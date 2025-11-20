// import card_file from './all_json_data';
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function handleButtonClick(times, list, guarantee) {
  // rollByRate nằm trong đây luôn
  const rollByRate = (rateDict) => {
    const rand = Math.random();
    let cumulative = 0;

    for (const key in rateDict) {
      cumulative += rateDict[key];
      if (rand <= cumulative) return key;
    }

    return Object.keys(rateDict).slice(-1)[0];
  };

  let result = {};
  let gua_result = {};
  let total = 0;
  let missingKey = null;
  let missingKey_er = null;

  list.forEach(item => {
    if (item.includes("~")) {
      const [key, valStr] = item.split("~").map(s => s.trim());
      const value = parseFloat(valStr.replace("%", "")) / 100;
      result[key] = value;
      total += value;
    } else {
      missingKey = item.trim();
    }
  });

  if (missingKey) {
    result[missingKey] = 1 - total;
  }

  guarantee.forEach(item => {
    if (item.includes("~")) {
      const [key, valStr] = item.split("~").map(s => s.trim());
      const value = parseFloat(valStr.replace("%", "")) / 100;
      gua_result[key] = value;
      total += value;
    } else {
      missingKey_er = item.trim();
    }
  });

  if (missingKey_er) {
    gua_result[missingKey_er] = 1 - total;
  }

  let gachas_ed = [];
  let gacha = [];

  // Thực hiện times lần roll theo tỷ lệ
  for (let i = 0; i < times; i++) {
    gachas_ed.push(rollByRate(result));
  }
  for (let i = 0; i < 1; i++) {
    gachas_ed.push(rollByRate(gua_result));
  }
  // Xử lý các lựa chọn ngẫu nhiên ("|") trong kết quả quay
// Xử lý các lựa chọn ngẫu nhiên ("|") trong kết quả quay
  gachas_ed.forEach(item => {
    if (item.includes("|")) {
      const choices = item.split("|").map(s => s.trim());
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      gacha.push(randomChoice);
    } else {
      gacha.push(item);
    }
  });

  // --- BỔ SUNG: TẠO ARRAY MỚI VÀ XỬ LÝ GROUP (2 SPACES INDENTATION) ---
  let gachaWithGroup = []; // Khai báo array mới
  gacha.forEach((item, k) => {
    // Logic Group
  if (item.includes("...")) {
    // Lấy A và B từ "A...B"
    const rangeMatch = item.match(/(\d+)\.\.\.(\d+)/);
    if (rangeMatch) {
      const A = parseInt(rangeMatch[1], 10);
      const B = parseInt(rangeMatch[2], 10);
      const C = getRandomInt(A, B);
      gacha[k] = item.replace(`${A}...${B}`, C); // thay "A...B" bằng "C"
    }
  }
    const match = gacha[k].match(/^(\d+)?\s*(\D*)$/);
    // const num = match[1] ? parseInt(match[1], 10) : 1; // Biến này không được sử dụng trong output
    let groupKey = match[2] ? match[2].trim() : "Task";

    // Thêm phần tử vào array mới
    gachaWithGroup.push(`${gacha[k]} ~ ${groupKey}`);
  });
  // --- KẾT THÚC BỔ SUNG ---
  let i = 0;
  gachaWithGroup.forEach(rawitem => {
    const item = rawitem.split("~")[0].trim();
    let NewGroup = rawitem.split("~")[1];
    NewGroup = NewGroup.split("/").pop().split(".")[0].trim();
    if (item.includes("File: ")) {
      const match = item.match(/File:\s*(.*)/);
      let linkfile = match[1].trim();
      const chosen_filecard = card_file["Hazard"][Math.floor(Math.random() * card_file["Hazard"].length)];

      gachaWithGroup[i] = `${chosen_filecard["Tag"]} ~ ${NewGroup}`;
    }
    i = i + 1;
  });

  
  let all_gacha = {};

  // Tổng hợp kết quả
  gachaWithGroup.forEach(item => {
    const match = item.match(/^(.*?)\s*~\s*(.*)$/); // Thêm comment: tách theo dấu ~
    let num = 1; // default
    if (match[1]) {
      const numMatch = match[1].match(/^\d+/); // lấy số từ đầu chuỗi
      if (numMatch) {
        num = parseInt(numMatch[0], 10);
      }
    }


    let key = match[2].trim();

    if (all_gacha[key]) all_gacha[key] += num;
    else all_gacha[key] = num;
  });

  return { list: gachaWithGroup, dict: all_gacha };
}

