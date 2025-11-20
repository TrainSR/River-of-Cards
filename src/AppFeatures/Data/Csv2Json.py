import csv
import json
import sys

def convert_csv_to_json(csv_file_path, json_file_path):
    data = []

    # Tăng giới hạn kích thước trường CSV
    max_int = sys.maxsize
    while True:
        try:
            csv.field_size_limit(max_int)
            break
        except OverflowError:
            # Nếu sys.maxsize quá lớn trên hệ thống, giảm dần
            max_int = int(max_int / 10)

    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
            csv_reader = csv.DictReader(csvfile)
            for row in csv_reader:
                row = {k: v for k, v in row.items() if v != ""}  # bỏ cột trống
                data.append(row)
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file CSV tại đường dẫn '{csv_file_path}'")
        return
    except Exception as e:
        print(f"Đã xảy ra lỗi khi đọc file CSV: {e}")
        return

    try:
        with open(json_file_path, mode='w', encoding='utf-8') as jsonfile:
            json.dump(data, jsonfile, indent=4, ensure_ascii=False)
        print(f"✅ Đã chuyển đổi thành công từ '{csv_file_path}' sang '{json_file_path}'")
        print(f"Tổng cộng đã ghi {len(data)} bản ghi vào file JSON.")
    except Exception as e:
        print(f"Đã xảy ra lỗi khi ghi file JSON: {e}")


CSV_INPUT_FILE = "Hazard.csv"
JSON_OUTPUT_FILE = "Hazard.json"

convert_csv_to_json(CSV_INPUT_FILE, JSON_OUTPUT_FILE)
