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

function fillSchedule() {
    // 取得 textarea 中的資料
    const inputData = document.getElementById('inputData').value;
    const lines = inputData.split('\n');

    const personSchedule = {}; // 儲存每個人的排班
    const personShiftCount = {}; // 儲存每個人已分配的班次數量
    const assignedShifts = {}; // 儲存每個班次的分配人員

    // 預先初始化所有班次為空數組
    for (let shift in mapping) {
        assignedShifts[shift] = [];
        // 清空每個班次顯示的內容
        const cell = document.getElementById(mapping[shift]);
        if (cell) {
            cell.textContent = '';
        }
    }

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
            personSchedule[name].push(shift);
            personShiftCount[name]++;
            assignedShifts[shift].push(name);
        }
    });

    for (let shift in assignedShifts) {
        const shiftPeople = assignedShifts[shift].length;
        if (shiftPeople === 0) {
            const emptyShift = shift;
            const availablePeople = findAvailablePeopleForShift(emptyShift, inputData);
            console.log("無人時段:", emptyShift, "的可用人員:", availablePeople);
    
            let personMoved = false;
    
            availablePeople.forEach(person => {
                if (personMoved) return;
    
                console.log(person, "的值班時段:", personSchedule[person]);
    
                for (let currentShift of personSchedule[person]) {
                    console.log(currentShift, "的值班人數:", assignedShifts[currentShift].length);
                    if (assignedShifts[currentShift].length > 1) {
                        // 確保 `currentShift` 和 `emptyShift` 在 `assignedShifts` 和 `personSchedule` 中存在
                        if (personSchedule[person].includes(currentShift)) {
                            // 移除該人員的當前時段
                            personSchedule[person] = personSchedule[person].filter(s => s !== currentShift);
                            assignedShifts[currentShift] = assignedShifts[currentShift].filter(p => p !== person);
    
                            // 更新該人員的時段安排，並將其添加到無人時段
                            personSchedule[person].push(emptyShift);
                            assignedShifts[emptyShift].push(person);
    
                            console.log("將", person, "從", currentShift, "轉移到", emptyShift);
                            console.log(person,"的值班時段:",personSchedule[person]);
                            console.log(emptyShift, "的值班人員:", assignedShifts[emptyShift]);
    
                            // 設置標誌為已經成功轉移，並跳出內部循環
                            personMoved = true;
                            break;
                        }
                    }
                }
            });
        }
    }

    // 更新班次顯示
    for (let shift in assignedShifts) {
        const cell = document.getElementById(mapping[shift]);
        if (cell) {
            cell.textContent = assignedShifts[shift].join(", ");
        }
    }

    

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

function findAvailablePeopleForShift(shift, inputData) {
    const lines = inputData.split('\n');
    const availablePeople = [];

    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const name = parts[0];
        const shifts = parts.slice(1);

        if (shifts.includes(shift)) {
            availablePeople.push(name);
        }
    });

    return availablePeople;
}