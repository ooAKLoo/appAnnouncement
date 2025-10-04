#!/usr/bin/env python3
"""
统一化素材文件命名脚本
将所有素材文件重命名为统一格式: {category}_{number}.svg
"""

import os
import re
from pathlib import Path

# 项目中素材目录路径
STICKERS_DIR = Path(__file__).parent / 'public' / 'stickers'

def natural_sort_key(s):
    """自然排序的key函数，让1, 2, 10正确排序而不是1, 10, 2"""
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', str(s))]

def rename_arrows():
    """重命名 arrows 目录：统一为 arrow_1.svg, arrow_2.svg, ..."""
    arrows_dir = STICKERS_DIR / 'arrows'
    if not arrows_dir.exists():
        print(f"❌ 目录不存在: {arrows_dir}")
        return

    # 获取所有 svg 文件并自然排序
    files = sorted([f for f in arrows_dir.iterdir() if f.suffix == '.svg'], key=natural_sort_key)

    print(f"\n🔄 处理 arrows 目录 ({len(files)} 个文件)...")

    # 先重命名为临时名称（避免冲突）
    temp_files = []
    for i, old_file in enumerate(files, 1):
        temp_name = arrows_dir / f'temp_arrow_{i}.svg'
        old_file.rename(temp_name)
        temp_files.append((temp_name, i))

    # 再重命名为最终名称
    for temp_file, i in temp_files:
        new_name = arrows_dir / f'arrow_{i}.svg'
        temp_file.rename(new_name)
        if i <= 5 or i > len(temp_files) - 3:  # 只显示前5个和后3个
            print(f"  ✅ {temp_file.name} → arrow_{i}.svg")
        elif i == 6:
            print(f"  ... ({len(temp_files) - 8} 个文件已处理) ...")

    print(f"✅ arrows 完成：{len(files)} 个文件")
    return len(files)

def rename_infographic():
    """重命名 infographic 目录：统一为 infographic_1.svg, infographic_2.svg, ..."""
    infographic_dir = STICKERS_DIR / 'infographic'
    if not infographic_dir.exists():
        print(f"❌ 目录不存在: {infographic_dir}")
        return

    # 获取所有 svg 文件并按名称排序
    files = sorted([f for f in infographic_dir.iterdir() if f.suffix == '.svg'], key=lambda x: x.name)

    print(f"\n🔄 处理 infographic 目录 ({len(files)} 个文件)...")

    # 先重命名为临时名称
    temp_files = []
    for i, old_file in enumerate(files, 1):
        temp_name = infographic_dir / f'temp_infographic_{i}.svg'
        print(f"  ✅ {old_file.name} → infographic_{i}.svg")
        old_file.rename(temp_name)
        temp_files.append((temp_name, i))

    # 再重命名为最终名称
    for temp_file, i in temp_files:
        new_name = infographic_dir / f'infographic_{i}.svg'
        temp_file.rename(new_name)

    print(f"✅ infographic 完成：{len(files)} 个文件")
    return len(files)

def check_category(category_name, expected_pattern):
    """检查某个分类是否已经符合命名规范"""
    category_dir = STICKERS_DIR / category_name
    if not category_dir.exists():
        return 0

    files = [f for f in category_dir.iterdir() if f.suffix == '.svg']

    # 检查是否都符合命名模式
    pattern = re.compile(expected_pattern)
    all_match = all(pattern.match(f.name) for f in files)

    if all_match:
        print(f"✅ {category_name}: 已符合规范 ({len(files)} 个文件)")
    else:
        print(f"⚠️  {category_name}: 需要检查命名")

    return len(files)

def main():
    print("=" * 60)
    print("素材文件统一命名脚本")
    print("=" * 60)

    if not STICKERS_DIR.exists():
        print(f"❌ 素材目录不存在: {STICKERS_DIR}")
        return

    print(f"\n📁 素材目录: {STICKERS_DIR}\n")

    # 检查已经规范的分类
    print("📋 检查现有文件命名...")
    doodles_count = check_category('doodles', r'^doodle_\d+\.svg$')
    illustrations_count = check_category('illustrations', r'^illustration_\d+\.svg$')
    underlines_count = check_category('underlines', r'^underline_\d+\.svg$')

    # 重命名需要处理的分类
    arrows_count = rename_arrows()
    infographic_count = rename_infographic()

    # 汇总统计
    print("\n" + "=" * 60)
    print("📊 重命名完成统计:")
    print("=" * 60)
    print(f"  箭头 (arrows):      {arrows_count} 个文件 → arrow_{{1..{arrows_count}}}.svg")
    print(f"  涂鸦 (doodles):     {doodles_count} 个文件 → doodle_{{1..{doodles_count}}}.svg")
    print(f"  插图 (illustrations): {illustrations_count} 个文件 → illustration_{{1..{illustrations_count}}}.svg")
    print(f"  信息图 (infographic): {infographic_count} 个文件 → infographic_{{1..{infographic_count}}}.svg")
    print(f"  下划线 (underlines):  {underlines_count} 个文件 → underline_{{1..{underlines_count}}}.svg")
    print("=" * 60)
    print(f"✅ 总计: {arrows_count + doodles_count + illustrations_count + infographic_count + underlines_count} 个素材文件")
    print("\n🎉 所有文件已统一命名！")

if __name__ == '__main__':
    main()
