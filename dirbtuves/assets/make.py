# Žaidimų dirbtuvės: molio stiliaus pavyzdiniai veikėjai ir fonai.
# Paleisti: blender -b --python make.py -- OUTDIR [vardas ...]
import bpy, bmesh, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
OUT = argv[0]
ONLY = set(argv[1:])
os.makedirs(OUT, exist_ok=True)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'GPU'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    try:
        prefs.compute_device_type = 'METAL'; prefs.get_devices()
        for d in prefs.devices: d.use = True
    except Exception: sc.cycles.device = 'CPU'
    sc.cycles.samples = 96
    sc.cycles.use_denoising = True
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (0.9, 0.93, 1.0, 1)
    w.node_tree.nodes['Background'].inputs[1].default_value = 0.25
    return sc

def mat(name, rgb, rough=0.55, emit=0.0, sss=0.08, coat=0.15):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = rough
    try:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (0.4, 0.25, 0.15)
        b.inputs['Coat Weight'].default_value = coat
    except KeyError: pass
    if emit:
        b.inputs['Emission Color'].default_value = (*rgb, 1)
        b.inputs['Emission Strength'].default_value = emit
    return m

def hexc(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)

def smooth(o, lvl=2):
    for p in o.data.polygons: p.use_smooth = True
    m = o.modifiers.new('s', 'SUBSURF'); m.levels = lvl; m.render_levels = lvl
    return o

def sphere(loc, scale, m, seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, location=loc)
    o = bpy.context.object; o.scale = scale; o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    return o

def eyes(z, x, y, r, front=-1, mood='happy'):
    black = mat('eye', hexc('#16183a'), 0.25)
    white = mat('glint', (1, 1, 1), 0.2, emit=1.5)
    for s in (-1, 1):
        sphere((s * x, front * y, z), (r, r * 0.6, r * 1.15), black)
        sphere((s * x + r * 0.35, front * (y + r * 0.45), z + r * 0.45), (r * 0.32, r * 0.2, r * 0.32), white)

def smile(z, y, w, front=-1, m=None):
    # šypsena: išlenkta kreivė su storiu
    cu = bpy.data.curves.new('smile', 'CURVE'); cu.dimensions = '3D'
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
    pts = [(-w, front * y, z), (0, front * (y + 0.04), z - w * 0.55), (w, front * y, z)]
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    cu.bevel_depth = w * 0.13; cu.bevel_resolution = 6; cu.use_fill_caps = True
    o = bpy.data.objects.new('smile', cu); bpy.context.collection.objects.link(o)
    o.data.materials.append(m or mat('mouth', hexc('#16183a'), 0.3))
    return o

def cheeks(z, x, y, r, front=-1):
    pink = mat('cheek', hexc('#ff7d9a'), 0.6)
    for s in (-1, 1): sphere((s * x, front * y, z), (r, r * 0.3, r * 0.7), pink)

def light_rig(sc, strength=1.0):
    d = bpy.data.lights.new('key', 'AREA'); d.energy = 420 * strength; d.size = 6
    o = bpy.data.objects.new('key', d); sc.collection.objects.link(o)
    o.location = (-3.5, -5, 6); o.rotation_euler = (math.radians(50), 0, math.radians(-35))
    f = bpy.data.lights.new('fill', 'AREA'); f.energy = 140 * strength; f.size = 8; f.color = (0.85, 0.9, 1)
    o2 = bpy.data.objects.new('fill', f); sc.collection.objects.link(o2)
    o2.location = (5, -4, 2); o2.rotation_euler = (math.radians(70), 0, math.radians(50))
    r = bpy.data.lights.new('rim', 'AREA'); r.energy = 260 * strength; r.size = 3; r.color = (1, 0.95, 0.85)
    o3 = bpy.data.objects.new('rim', r); sc.collection.objects.link(o3)
    o3.location = (2, 5, 4); o3.rotation_euler = (math.radians(-60), 0, math.radians(160))

def ortho_cam(sc, size, z=0.0, tilt=8):
    cam = bpy.data.cameras.new('c'); cam.type = 'ORTHO'; cam.ortho_scale = size
    o = bpy.data.objects.new('c', cam); sc.collection.objects.link(o); sc.camera = o
    o.location = (0, -20, z + 20 * math.tan(math.radians(tilt))); o.rotation_euler = (math.radians(90 - tilt), 0, 0)

def render_obj(name, size=2.6, z=0.0, px=512):
    sc = bpy.context.scene
    sc.render.film_transparent = True
    sc.render.resolution_x = sc.render.resolution_y = px
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    ortho_cam(sc, size, z); light_rig(sc)
    sc.render.filepath = os.path.join(OUT, name + '.png')
    bpy.ops.render.render(write_still=True)

# ---------------- veikėjai ----------------
def blob():
    reset()
    body = mat('body', hexc('#ffc53d'))
    sphere((0, 0, 0), (1, 0.85, 0.92), body, 64)
    for s in (-1, 1):  # rankytės ir kojytės
        a = sphere((s * 1.0, 0, -0.05), (0.2, 0.18, 0.3), body); a.rotation_euler = (0, s * 0.6, 0)
        sphere((s * 0.38, -0.05, -0.92), (0.24, 0.24, 0.14), mat('feet', hexc('#ff9f1c')))
    eyes(0.15, 0.32, 0.8, 0.11); cheeks(-0.1, 0.55, 0.72, 0.12); smile(-0.16, 0.86, 0.2)
    render_obj('hero-blob', 2.9)

def bird():
    reset()
    body = mat('body', hexc('#ff8a3d'))
    sphere((0, 0, 0), (1, 0.9, 0.9), body, 64)
    sphere((0.05, -0.35, -0.3), (0.65, 0.6, 0.55), mat('belly', hexc('#ffe1b8')))
    for s in (-1, 1):
        w = sphere((s * 0.95, 0.05, 0.05), (0.18, 0.45, 0.32), mat('wing', hexc('#e5641f'))); w.rotation_euler = (0.3, s * 0.5, s * 0.2)
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.2, depth=0.38, location=(0, -0.98, 0.0), rotation=(math.radians(90), 0, 0))
    bk = bpy.context.object; bk.data.materials.append(mat('beak', hexc('#ffc53d'))); smooth(bk, 1)
    sphere((0, 0.05, 0.92), (0.12, 0.12, 0.18), body)  # kuodelis
    eyes(0.32, 0.33, 0.78, 0.1); cheeks(0.05, 0.58, 0.7, 0.1)
    render_obj('hero-bird', 2.9)

def ghosty():
    reset()
    m = mat('ghost', hexc('#eef1ff'), 0.5, sss=0.3)
    c = sphere((0, 0, 0), (1, 1, 1), m, 96)
    bm = bmesh.new(); bm.from_mesh(c.data)
    for v in bm.verts:
        v.co.x *= 0.85; v.co.y *= 0.8; v.co.z *= 1.15
        if v.co.z < -0.15:
            a = math.atan2(v.co.y, v.co.x); k = min(1, (-0.15 - v.co.z) / 0.5)
            v.co.z = max(v.co.z, -0.95) + 0.12 * k * math.sin(a * 7); v.co.x *= 1 + 0.12 * k; v.co.y *= 1 + 0.12 * k
    bm.to_mesh(c.data); bm.free()
    for s in (-1, 1): sphere((s * 0.86, -0.05, -0.05), (0.18, 0.16, 0.26), m)
    eyes(0.32, 0.28, 0.76, 0.12); cheeks(0.06, 0.5, 0.7, 0.1); smile(0.02, 0.8, 0.13)
    render_obj('ghost', 2.9, z=-0.1)

def apple():
    reset()
    red = mat('apple', hexc('#ff4d4f'), 0.35, sss=0.05)
    sphere((0, 0, 0), (1, 0.95, 0.9), red, 64)
    o = bpy.context.object
    bm = bmesh.new(); bm.from_mesh(o.data)
    for v in bm.verts:  # įdubimas viršuje
        r = math.hypot(v.co.x, v.co.y)
        if v.co.z > 0: v.co.z -= 0.22 * math.exp(-(r * 3.2) ** 2)
    bm.to_mesh(o.data); bm.free()
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.06, depth=0.45, location=(0.02, 0, 0.88), rotation=(0, math.radians(12), 0))
    bpy.context.object.data.materials.append(mat('stem', hexc('#7a4a1c'))); smooth(bpy.context.object, 1)
    lf = sphere((0.3, 0, 0.98), (0.32, 0.1, 0.15), mat('leaf', hexc('#3fbf5f'), 0.45)); lf.rotation_euler = (0, math.radians(-25), math.radians(-10))
    render_obj('apple', 2.6)

def spike():
    reset()
    m = mat('spike', hexc('#8a5cf6'), 0.4)
    sphere((0, 0, 0), (0.72, 0.72, 0.72), m, 64)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1)
    ico = bpy.context.object; verts = [v.co.copy() for v in ico.data.vertices]; bpy.data.objects.remove(ico)
    for v in verts:
        d = v.normalized()
        if d.y < -0.8: continue  # veidas lieka laisvas
        bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.22, depth=0.5, location=d * 0.88)
        cn = bpy.context.object; cn.rotation_mode = 'QUATERNION'; cn.rotation_quaternion = d.to_track_quat('Z', 'Y')
        cn.data.materials.append(m); smooth(cn, 1)
    eyes(0.12, 0.24, 0.66, 0.1); smile(-0.15, 0.7, 0.15)
    render_obj('spike', 2.8)

def star():
    reset()
    m = mat('star', hexc('#ffc93c'), 0.3)
    bm = bmesh.new(); pts = []
    for i in range(10):
        a = math.pi / 2 + i * math.pi / 5; r = 1.0 if i % 2 == 0 else 0.48
        pts.append(bm.verts.new((r * math.cos(a), 0, r * math.sin(a))))
    f = bm.faces.new(pts)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in ext['geom']:
        if isinstance(v, bmesh.types.BMVert): v.co.y += 0.36
    for v in bm.verts: v.co.y -= 0.18
    me = bpy.data.meshes.new('star'); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('star', me); bpy.context.collection.objects.link(o); o.data.materials.append(m)
    bv = o.modifiers.new('b', 'BEVEL'); bv.width = 0.14; bv.segments = 6
    smooth(o, 2)
    eyes(0.08, 0.17, 0.24, 0.07); smile(-0.12, 0.27, 0.1)
    render_obj('star', 2.5)

def pillar():
    reset()
    g = mat('pillar', hexc('#3fbf5f'), 0.45); gd = mat('rim', hexc('#2f9a49'), 0.45)
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.5, depth=4.0); c = bpy.context.object; c.data.materials.append(g)
    for p in c.data.polygons: p.use_smooth = True
    for z in (-0.5, 0.5):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.5, minor_radius=0.06, major_segments=96, location=(0, 0, z)); t = bpy.context.object; t.data.materials.append(gd)
        for p in t.data.polygons: p.use_smooth = True
    sc = bpy.context.scene
    sc.render.resolution_x = 300; sc.render.resolution_y = 512
    sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'
    ortho_cam(sc, 2.0, 0, tilt=0); light_rig(sc)
    sc.render.filepath = os.path.join(OUT, 'pillar.png'); bpy.ops.render.render(write_still=True)

# ---------------- fonai ----------------
def bg_scene(name, top, bottom, build):
    reset()
    sc = bpy.context.scene
    sc.render.film_transparent = False
    sc.render.resolution_x = 1536; sc.render.resolution_y = 768
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGB'
    # dangus: gradientas ant plokštumos gale
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 12, 0), rotation=(math.radians(90), 0, 0))
    p = bpy.context.object; p.scale = (40, 24, 1)
    m = bpy.data.materials.new('sky'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); ramp = nt.nodes.new('ShaderNodeValToRGB')
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['Generated'], sep.inputs[0]); nt.links.new(sep.outputs['Y'], ramp.inputs['Fac'])
    ramp.color_ramp.elements[0].color = (*bottom, 1); ramp.color_ramp.elements[1].color = (*top, 1)
    nt.links.new(ramp.outputs['Color'], em.inputs['Color']); em.inputs['Strength'].default_value = 1.0
    nt.links.new(em.outputs[0], out.inputs[0]); p.data.materials.append(m)
    p.visible_shadow = False
    build()
    cam = bpy.data.cameras.new('c'); cam.type = 'ORTHO'; cam.ortho_scale = 16
    o = bpy.data.objects.new('c', cam); sc.collection.objects.link(o); sc.camera = o
    o.location = (0, -20, 0); o.rotation_euler = (math.radians(90), 0, 0)
    light_rig(sc, 3.0)
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 2.2; sun.angle = math.radians(20)
    so = bpy.data.objects.new('sun', sun); sc.collection.objects.link(so); so.rotation_euler = (math.radians(55), 0, math.radians(-30))
    sc.render.filepath = os.path.join(OUT, name + '.png'); bpy.ops.render.render(write_still=True)

def hill(x, z, rx, rz, col, y=0):
    o = sphere((x, y, z), (rx, 1.2, rz), mat('h', hexc(col), 0.9, sss=0.02, coat=0), 64)
    return o

def cloud(x, z, s, y=4):
    m = mat('cloud', (0.97, 0.98, 1), 0.6, sss=0.2)
    for dx, dz, r in [(-0.9, 0, .6), (-0.2, 0.3, .85), (0.6, 0.1, .7), (1.2, -0.1, .45), (0.1, -0.25, .65)]:
        sphere((x + dx * s, y, z + dz * s), (r * s, r * s * 0.8, r * s), m)

def meadow():
    def b():
        hill(-5.5, -5.6, 7, 3.4, '#7fd36b', 2); hill(5, -5.8, 8, 3.6, '#7fd36b', 2.5)
        hill(-2, -6.6, 9, 3.4, '#5cbf3a', 0); hill(7, -6.8, 6, 3.2, '#5cbf3a', 0.5)
        s = sphere((5.4, 8, 2.6), (0.9, 0.9, 0.9), mat('sun', hexc('#ffd23f'), emit=4.0))
        cloud(-4.5, 2.8, 0.9); cloud(1.5, 3.3, 0.7)
    bg_scene('bg-meadow', hexc('#8fd0ff'), hexc('#e6f6ff'), b)

def night():
    def b():
        hill(-5, -5.8, 8, 3.2, '#2a3170', 2); hill(6, -6.0, 7, 3.3, '#2a3170', 2.5)
        hill(0, -7.0, 11, 3.4, '#1d2357', 0)
        sphere((-5.2, 8, 2.6), (0.85, 0.85, 0.85), mat('moon', hexc('#ffe9a8'), emit=1.1))
        import random; random.seed(4)
        for i in range(46):
            x = random.uniform(-8, 8); z = random.uniform(-1.2, 3.9)
            if abs(x + 5.2) < 1.2 and abs(z - 2.6) < 1.2: continue
            r = random.uniform(0.03, 0.08)
            sphere((x, 8, z), (r, r, r), mat('st', (1, 0.95, 0.8), emit=random.uniform(3, 8)), 12)
    bg_scene('bg-night', hexc('#141a4a'), hexc('#3a3f8f'), b)

def sky():
    def b():
        cloud(-5.6, 2.4, 1.0); cloud(-0.5, 3.2, 0.75); cloud(4.8, 1.6, 1.1); cloud(1.5, -2.6, 0.8, 3); cloud(-4.0, -2.2, 0.6, 3); cloud(6.4, -3.0, 0.7, 3)
    bg_scene('bg-sky', hexc('#7cc4ff'), hexc('#d8efff'), b)

JOBS = {'hero-blob': blob, 'hero-bird': bird, 'ghost': ghosty, 'apple': apple, 'spike': spike, 'star': star, 'pillar': pillar,
        'bg-meadow': meadow, 'bg-night': night, 'bg-sky': sky}
for k, f in JOBS.items():
    if not ONLY or k in ONLY:
        f(); print('RENDERED', k)
