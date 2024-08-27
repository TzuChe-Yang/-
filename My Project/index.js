const mapping = {
    "一B": "B_Mon", "二B": "B_Tue", "三B": "B_Wed", "四B": "B_Thu", "五B": "B_Fri",
    "一C": "C_Mon", "二C": "C_Tue", "三C": "C_Wed", "四C": "C_Thu", "五C": "C_Fri",
    "一D": "D_Mon", "二D": "D_Tue", "三D": "D_Wed", "四D": "D_Thu", "五D": "D_Fri",
    "一X": "X_Mon", "二X": "X_Tue", "三X": "X_Wed", "四X": "X_Thu", "五X": "X_Fri",
    "一E": "E_Mon", "二E": "E_Tue", "三E": "E_Wed", "四E": "E_Thu", "五E": "E_Fri",
    "一F": "F_Mon", "二F": "F_Tue", "三F": "F_Wed", "四F": "F_Thu", "五F": "F_Fri",
    "一G": "G_Mon", "二G": "G_Tue", "三G": "G_Wed", "四G": "G_Thu", "五G": "G_Fri",
    "一H": "H_Mon", "二H": "H_Tue", "三H": "H_Wed", "四H": "H_Thu", "五H": "H_Fri",
    "一Y": "Y_Mon", "二Y": "Y_Tue", "三Y": "Y_Wed", "四Y": "Y_Thu", "五Y": "Y_Fri",
    "一I": "I_Mon", "二I": "I_Tue", "三I": "I_Wed", "四I": "I_Thu", "五I": "I_Fri",
    "一J": "J_Mon", "二J": "J_Tue", "三J": "J_Wed", "四J": "J_Thu", "五J": "J_Fri"
};

// 初始化所有時段的使用者清單
const initializeSchedule = () => {
    for (let id in mapping) {
        const cell = document.getElementById(mapping[id]);
        cell.textContent = ""; // 清空單元格內容
    }
};

function fillSchedule() {
    // 取得 textarea 中的資料
    const inputData = document.getElementById('inputData').value;
    const lines = inputData.split('\n');
    
    const personSchedule = {}; // 儲存每個人的排班
    const personShiftCount = {}; // 儲存每個人已分配的班次數量
    const assignedShifts = {}; // 儲存每個班次的分配人員

    // 初始排班
    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const name = parts[0];

        // 初始化每個人的排班記錄
        personSchedule[name] = [];
        personShiftCount[name] = 0;

        // 排班，最多分配3個班次
        for (let i = 1; i < parts.length && personShiftCount[name] < 3; i++) {
            const shift = parts[i];
            const cellId = mapping[shift];
            if (cellId) {
                const cell = document.getElementById(cellId);
                // 確保每個班次至少有一名人員
                if (!assignedShifts[shift]) {
                    assignedShifts[shift] = [];
                }

                if (assignedShifts[shift].length === 0 || personShiftCount[name] < 3) {
                    if (cell.textContent) {
                        cell.textContent += ", " + name;
                    } else {
                        cell.textContent = name;
                    }
                    personSchedule[name].push(shift);
                    personShiftCount[name]++;
                    assignedShifts[shift].push(name);
                }
            }
        }
    });

    // 檢查空缺並進行調整
    const shifts = Object.keys(mapping);
    shifts.forEach(shift => {
        // 如果班次沒有分配人員，則進行補充
        if (!assignedShifts[shift] || assignedShifts[shift].length === 0) {
            let assigned = false;

            // 優先從人數最多的班次中找人
            Object.keys(assignedShifts).forEach(otherShift => {
                if (assignedShifts[otherShift] && assignedShifts[otherShift].length > 0) {
                    assignedShifts[otherShift].forEach(person => {
                        if (!assigned && personShiftCount[person] < 3) {
                            // 確保該人選可以接受該班次
                            if (lines.some(line => line.includes(person) && line.includes(shift))) {
                                const cellId = mapping[shift];
                                const cell = document.getElementById(cellId);
                                if (cell.textContent) {
                                    cell.textContent += ", " + person;
                                } else {
                                    cell.textContent = person;
                                }
                                personSchedule[person].push(shift);
                                personShiftCount[person]++;
                                assignedShifts[shift] = [person];
                                assigned = true;
                            }
                        }
                    });
                }
            });

            // 如果還是沒有人，則隨機選擇一個可以接受的人
            if (!assigned) {
                const availablePeople = Object.keys(personSchedule).filter(person => personShiftCount[person] < 3);
                if (availablePeople.length > 0) {
                    const person = availablePeople[Math.floor(Math.random() * availablePeople.length)];
                    const cellId = mapping[shift];
                    const cell = document.getElementById(cellId);
                    if (cell.textContent) {
                        cell.textContent += ", " + person;
                    } else {
                        cell.textContent = person;
                    }
                    personSchedule[person].push(shift);
                    personShiftCount[person]++;
                    assignedShifts[shift] = [person];
                }
            }
        }
    });

    // 最後確保每個人恰好有 3 個班次
    Object.keys(personSchedule).forEach(person => {
        while (personShiftCount[person] > 3) {
            // 調整班次使每人只有 3 班
            const shiftToRemove = personSchedule[person].pop();
            assignedShifts[shiftToRemove] = assignedShifts[shiftToRemove].filter(p => p !== person);
            personShiftCount[person]--;
        }
    });

    // 獲取 personScheduleTable 的 tbody 元素
    const personScheduleTableBody = document.getElementById('personScheduleTable').querySelector('tbody');

    // 清空表格內容
    personScheduleTableBody.innerHTML = '';

    // 將每個人的排班時段輸出到表格中
    for (let person in personSchedule) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const scheduleCell = document.createElement('td');

        nameCell.textContent = person;
        scheduleCell.textContent = personSchedule[person].join(", ");

        row.appendChild(nameCell);
        row.appendChild(scheduleCell);
        personScheduleTableBody.appendChild(row);
    }
}
