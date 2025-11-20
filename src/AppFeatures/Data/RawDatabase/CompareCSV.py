import csv

def read_csv(filepath):
    """Đọc CSV và trả về header + danh sách các dòng (list of dict)."""
    with open(filepath, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        header = reader.fieldnames
        rows = list(reader)
        return header, rows


def compare_csv_two_way(file_a, file_b, output_file):
    # Đọc hai file CSV
    header_a, rows_a = read_csv(file_a)
    header_b, rows_b = read_csv(file_b)

    # Kiểm tra format (header)
    if header_a != header_b:
        print("❌ Lỗi: Hai file CSV không cùng định dạng (header khác nhau). Dừng xử lý.")
        print("Header File A:", header_a)
        print("Header File B:", header_b)
        return

    # Chuyển dict → tuple để so sánh
    set_a = {tuple(row.items()) for row in rows_a}
    set_b = {tuple(row.items()) for row in rows_b}

    # Tìm khác biệt 2 chiều
    diff_a_only = set_a - set_b  # trong A mà không có B
    diff_b_only = set_b - set_a  # trong B mà không có A

    # Chuyển tuple → dict để ghi CSV
    diff_rows = [dict(row) for row in diff_a_only] + [dict(row) for row in diff_b_only]

    # Xuất ra file CSV mới
    with open(output_file, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=header_a)
        writer.writeheader()
        writer.writerows(diff_rows)

    print(f"✅ Hoàn tất! Đã xuất {len(diff_rows)} dòng khác biệt (2 chiều) vào '{output_file}'.")


# -----------------------------
# CẤU HÌNH TÊN FILE
# -----------------------------
FILE_A = "file1.csv"
FILE_B = "file2.csv"
OUTPUT_FILE = "difference.csv"

# -----------------------------
# CHẠY HÀM
# -----------------------------
compare_csv_two_way(FILE_A, FILE_B, OUTPUT_FILE)
