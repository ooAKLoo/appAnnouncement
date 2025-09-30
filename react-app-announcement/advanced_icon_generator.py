#!/usr/bin/env python3
"""
Tauri macOS 图标问题诊断和修复工具
"""

import os
import sys
import subprocess
from PIL import Image, ImageDraw, ImageChops
import json

def _analyze_transparency(img, label="图像"):
    """输出图像透明度与内容占比诊断信息"""
    try:
        size = img.size[0]
        bands = img.getbands()
        has_alpha = 'A' in bands
        print(f"\n🧪 {label} 诊断：{img.mode} {img.size}  带Alpha: {has_alpha}")
        if not has_alpha:
            print("   • 无Alpha通道（四角不会是透明）")
            return

        alpha = img.getchannel('A')
        # 采样四角与边缘
        corners = {
            '左上': alpha.getpixel((0, 0)),
            '右上': alpha.getpixel((size - 1, 0)),
            '左下': alpha.getpixel((0, size - 1)),
            '右下': alpha.getpixel((size - 1, size - 1)),
        }
        # 内容边界（以阈值10判断非透明）
        thresh = alpha.point(lambda a: 255 if a > 10 else 0)
        bbox = thresh.getbbox()
        if bbox:
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            ratio = max(w, h) / size
            print(f"   • 四角Alpha: {corners}")
            print(f"   • 内容边界: {bbox}，最大边比例: {ratio:.2f}")
            if all(v > 0 for v in corners.values()):
                print("   • 警告：四角非透明 → 图标会呈正方形边角（无圆角效果）")
            if ratio >= 0.90:
                print("   • 提示：内容占比偏大（>=0.90），肉眼看会比其它App更大")
        else:
            print("   • 未检测到非透明内容（可能整张图像几乎透明）")
    except Exception as e:
        print(f"   • 透明度诊断失败：{e}")

def diagnose_current_icons():
    """诊断当前的图标文件"""
    print("\n🔍 诊断当前图标文件...")
    print("=" * 50)
    
    icons_dir = 'src-tauri/icons'
    
    # 检查关键文件
    critical_files = [
        'icon.icns',
        'icon.png', 
        '128x128.png',
        '128x128@2x.png',
        '32x32.png'
    ]
    
    for filename in critical_files:
        path = os.path.join(icons_dir, filename)
        if os.path.exists(path):
            # 检查文件实际格式
            try:
                img = Image.open(path)
                actual_format = img.format
                size = img.size
                mode = img.mode
                
                # 特别检查.icns文件
                if filename.endswith('.icns'):
                    if actual_format != 'ICNS':
                        print(f"❌ {filename}: 假ICNS！实际是{actual_format}格式")
                        print(f"   这会导致macOS无法正确识别图标！")
                    else:
                        print(f"✅ {filename}: 真ICNS文件 - {size}")
                else:
                    print(f"✅ {filename}: {actual_format} - {size} - {mode}")
                    _analyze_transparency(img, label=f"{filename}")
                    
            except Exception as e:
                # 可能是真的ICNS文件，PIL打不开
                if filename.endswith('.icns'):
                    # 用file命令检查
                    result = subprocess.run(['file', path], capture_output=True, text=True)
                    if 'Apple icon' in result.stdout:
                        print(f"✅ {filename}: 真ICNS文件（Apple icon format）")
                    else:
                        print(f"❓ {filename}: 未知格式 - {result.stdout.strip()}")
                else:
                    print(f"❌ {filename}: 无法打开 - {e}")
        else:
            print(f"❌ {filename}: 文件缺失")

def _rounded_mask(size, radius_ratio=0.22):
    """生成圆角遮罩（近似macOS风格，比例可调）。返回L模式mask。"""
    r = int(size * radius_ratio)
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size, size), radius=r, fill=255)
    return mask

def fix_icon_with_proper_ratio(source_image_path, target_ratio=0.8, add_subtle_bg=False, auto_round=True, corner_radius_ratio=0.22):
    """
    修复图标，使用正确的内容占比
    
    Args:
        source_image_path: 原始图标路径
        target_ratio: 目标内容占比（默认80%）
        add_subtle_bg: 是否添加微妙背景以确保圆角（默认True）
    """
    print(f"\n🔧 修复图标（内容占比：{target_ratio:.0%}）...")
    print("=" * 50)
    
    # 打开原图
    img = Image.open(source_image_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # 确保是正方形
    if img.size[0] != img.size[1]:
        size = min(img.size)
        img = img.crop((
            (img.width - size) // 2,
            (img.height - size) // 2,
            (img.width + size) // 2,
            (img.height + size) // 2
        ))
    
    print(f"原始图片：{img.size}")
    _analyze_transparency(img, label="原始图片")
    
    # 统一处理为1024基准画布，内容占比=target_ratio
    base = 1024
    content = int(base * target_ratio)
    # 创建背景（默认透明）
    bg_color = (255, 255, 255, 3) if add_subtle_bg else (0, 0, 0, 0)
    canvas = Image.new('RGBA', (base, base), bg_color)

    # 将原图缩放到目标内容尺寸
    img_resized = img.resize((content, content), Image.Resampling.LANCZOS)
    offset = ((base - content) // 2, (base - content) // 2)

    # 智能圆角：若原始图四角不透明或内容边比例>=0.95，则对“内容区域”应用圆角遮罩
    need_round = False
    try:
        alpha_src = img_resized.getchannel('A')
        src_corners = [alpha_src.getpixel((0, 0)), alpha_src.getpixel((content-1, 0)), alpha_src.getpixel((0, content-1)), alpha_src.getpixel((content-1, content-1))]
        non_transparent_src_corners = all(v > 0 for v in src_corners)
        bbox_src = alpha_src.point(lambda a: 255 if a > 10 else 0).getbbox()
        ratio_src = 1.0
        if bbox_src:
            w = bbox_src[2] - bbox_src[0]
            h = bbox_src[3] - bbox_src[1]
            ratio_src = max(w, h) / content
        need_round = non_transparent_src_corners or ratio_src >= 0.95
    except Exception:
        need_round = True

    if auto_round and need_round:
        content_mask = _rounded_mask(content, radius_ratio=corner_radius_ratio)
        # 结合原图alpha与圆角mask
        combined_mask = ImageChops.multiply(img_resized.getchannel('A'), content_mask)
        canvas.paste(img_resized, offset, combined_mask)
        print("✅ 已对内容区域应用圆角遮罩（轮廓圆角）")
    else:
        canvas.paste(img_resized, offset, img_resized)

    img = canvas
    print(f"已调整内容占比至 {target_ratio:.0%}")
    _analyze_transparency(img, label="处理后（用于导出）")

    return img

def generate_all_icons(base_img):
    """生成所有需要的图标文件"""
    print("\n📦 生成所有图标文件...")
    print("=" * 50)
    
    icons_dir = 'src-tauri/icons'
    os.makedirs(icons_dir, exist_ok=True)
    
    # Tauri配置中需要的文件
    required_icons = [
        (32, '32x32.png'),
        (128, '128x128.png'),
        (256, '128x128@2x.png'),
        (1024, 'icon.png'),
        (256, 'icon.ico')
    ]
    
    # 生成PNG和ICO
    for size, filename in required_icons:
        resized = base_img.resize((size, size), Image.Resampling.LANCZOS)
        path = os.path.join(icons_dir, filename)
        
        if filename.endswith('.ico'):
            resized.save(path, 'ICO')
        else:
            resized.save(path, 'PNG', optimize=True)
        
        print(f"✅ {filename} ({size}x{size})")
        if filename.endswith('.png') and size in (256, 512, 1024):
            # 对大尺寸做一次透明度与占比分析
            _analyze_transparency(resized, label=f"导出预览 {filename}")
    
    # 生成真正的ICNS
    generate_real_icns(base_img, icons_dir)

def generate_real_icns(base_img, icons_dir):
    """生成真正的ICNS文件"""
    print("\n🍎 生成真正的ICNS文件...")
    
    # 创建临时iconset目录
    iconset_dir = os.path.join(icons_dir, 'icon.iconset')
    os.makedirs(iconset_dir, exist_ok=True)
    
    # ICNS需要的完整尺寸集
    icns_sizes = [
        (16, 'icon_16x16.png'),
        (32, 'icon_16x16@2x.png'),
        (32, 'icon_32x32.png'),
        (64, 'icon_32x32@2x.png'),
        (128, 'icon_128x128.png'),
        (256, 'icon_128x128@2x.png'),
        (256, 'icon_256x256.png'),
        (512, 'icon_256x256@2x.png'),
        (512, 'icon_512x512.png'),
        (1024, 'icon_512x512@2x.png'),
    ]
    
    # 生成所有尺寸
    for size, filename in icns_sizes:
        resized = base_img.resize((size, size), Image.Resampling.LANCZOS)
        path = os.path.join(iconset_dir, filename)
        resized.save(path, 'PNG', optimize=True)
        if size in (512, 1024):
            _analyze_transparency(resized, label=f"iconset/{filename}")
    
    # 使用iconutil生成真正的ICNS
    icns_path = os.path.join(icons_dir, 'icon.icns')
    
    try:
        # 先删除旧的假ICNS
        if os.path.exists(icns_path):
            os.remove(icns_path)
            print("删除旧的ICNS文件")
        
        # 生成新的真ICNS
        result = subprocess.run(
            ['iconutil', '-c', 'icns', iconset_dir, '-o', icns_path],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"✅ 真正的ICNS文件已生成！")
            # 清理临时目录
            import shutil
            shutil.rmtree(iconset_dir)
        else:
            print(f"❌ 生成ICNS失败：{result.stderr}")
            print(f"\n请手动运行：")
            print(f"iconutil -c icns {iconset_dir} -o {icns_path}")
            
    except FileNotFoundError:
        print("❌ iconutil命令不可用")
        print(f"\n请手动运行：")
        print(f"iconutil -c icns {iconset_dir} -o {icns_path}")

def verify_tauri_config():
    """验证Tauri配置"""
    print("\n📋 验证Tauri配置...")
    print("=" * 50)
    
    config_path = 'src-tauri/tauri.conf.json'
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    icons = config.get('tauri', {}).get('bundle', {}).get('icon', [])
    print("配置的图标文件：")
    for icon in icons:
        print(f"  • {icon}")
        if 'icon.icns' not in icon and icon.endswith('.icns'):
            print("    ⚠️ 警告：ICNS文件名不标准")
    
    if 'icons/icon.icns' in icons:
        print("\n✅ 配置正确包含icon.icns")
    else:
        print("\n❌ 配置中缺少icons/icon.icns！")

def main():
    print("🚀 Tauri macOS 图标完整修复工具")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("\n使用方法:")
        print("  python advanced_icon_generator.py <原始图标路径> [内容占比]")
        print("\n示例:")
        print("  python advanced_icon_generator.py icon.png        # 使用默认80%")
        print("  python advanced_icon_generator.py icon.png 0.75   # 使用75%")
        print("  python advanced_icon_generator.py icon.png 0.85   # 使用85%")
        print("\n建议:")
        print("  • 如果图标显示偏小：使用 0.8 或 0.85")
        print("  • 如果图标显示偏大：使用 0.75")
        print("\n关于圆角:")
        print("  • 脚本会在检测到四角非透明或内容占比过大时，自动应用圆角遮罩")
        print("  • 若希望保持直角方形，可传入 add_subtle_bg=True（当前默认关闭）")
        return
    
    source_path = sys.argv[1]
    target_ratio = float(sys.argv[2]) if len(sys.argv) > 2 else 0.8
    
    # Step 1: 诊断当前状态
    diagnose_current_icons()
    
    # Step 2: 验证配置
    verify_tauri_config()
    
    # Step 3: 智能修复图标（自动圆角 + 内容占比）
    fixed_img = fix_icon_with_proper_ratio(source_path, target_ratio, add_subtle_bg=False, auto_round=True)
    
    # Step 4: 生成所有文件
    generate_all_icons(fixed_img)
    
    # Step 5: 再次诊断
    print("\n" + "=" * 60)
    print("修复后的状态：")
    diagnose_current_icons()
    
    print("\n" + "=" * 60)
    print("✅ 修复完成！")
    print("\n下一步：")
    print("1. npm run tauri build")
    print("2. 清除缓存：killall Dock && killall Finder")
    print("3. 如果仍有问题，尝试删除旧的.app文件后重新构建")
    print("\n💡 提示：")
    print("• 确保使用了真正的ICNS文件（不是PNG改名）")
    print("• 默认自动应用圆角遮罩（如检测到四角不透明/内容占比过大）")
    print("• 内容占比80%通常较合适；偏大则下调到0.75–0.78")
    print("• 如需直角方形，可在代码中将 add_subtle_bg=True")
    print("• 如果还是有问题，可能需要清理构建缓存：")
    print("  rm -rf src-tauri/target")

if __name__ == "__main__":
    main()
