const gradeBase = {
        10: 170000, 9: 185000, 8: 260000, 7: 296000, 6: 362000, 5: 429000, 4: 509000, 3: 600000, 2: 723000, 1: 910000
    };
    const LEADERSHIP_GRADES = ['GM', 'SP', 'UM'];
    const stageAddLogic = (grade) => {
        const defaultAdd = {
            10: 3000, 9: 5000, 8: 3000, 7: 6000, 6: 6000, 5: 6000, 4: 8000, 3: 10000, 2: 17000, 1: 20000
        };
        if (LEADERSHIP_GRADES.includes(grade)) {
            return 83000;
        }
        return defaultAdd[grade] || 0;
    };
    const gradeMaxNominal = {
        10: 200000, 9: 240000
    };
    const DEDUCTIONS = {
        HEALTH_INSURANCE: 00000,
        SOCIAL_SOLIDARITY: 2000,
        CHILD_HOSPITAL_SUPPORT: 1000,
        PREVIOUS_DEDUCTION: 1950
    };
    const POSITION_DEDUCTIONS = {
        'section-head': 0.15,
        'department-head': 0.20,
        'director': 0.30
    };
    const OVERTIME_RATES = {
        'high_grade': 5000,
        'low_grade': 4000,
        'leadership': 5000
    };
    const LOCATION_FIXED_BONUS = 50000;

    function formatDate(dateObj) {
        if (!(dateObj instanceof Date) || isNaN(dateObj)) return "غير محدد";
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    function calculatePromotions(lastPromotionDate, currentGrade, currentStage, bonusMonths) {
        if (!lastPromotionDate) return null;
        const lastDate = new Date(lastPromotionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (LEADERSHIP_GRADES.includes(currentGrade)) {
            return {
                type: 'leadership',
                message: 'درجة قيادية - لا توجد ترقية أو علاوة سنوية تلقائية'
            };
        }
        const gradeNumber = parseInt(currentGrade);
        let originalYears = 0;
        let nextGrade = currentGrade;
        let nextStage = 1;
        let nextPromotionDate = null;
        if (gradeNumber >= 6 && gradeNumber <= 10) {
            originalYears = 5;
            nextGrade = gradeNumber > 6 ? (gradeNumber - 1).toString() : "5";
        } else if (gradeNumber >= 1 && gradeNumber <= 5) {
            originalYears = 6;
            nextGrade = gradeNumber > 1 ? (gradeNumber - 1).toString() : "GM";
        }
        const effectiveYears = originalYears - (currentStage - 1);
        let promotionOverdueYears = 0;
        if (originalYears > 0) {
            if (effectiveYears <= 0) {
                promotionOverdueYears = Math.round(-effectiveYears);
            }
            nextPromotionDate = new Date(lastDate);
            const totalMonthsToWait = Math.round(effectiveYears * 12);
            nextPromotionDate.setMonth(nextPromotionDate.getMonth() + totalMonthsToWait);
            nextPromotionDate.setMonth(nextPromotionDate.getMonth() - bonusMonths);
            nextPromotionDate.setHours(0, 0, 0, 0);
        }
        let nextAnnualIncreaseDate = new Date(lastDate);
        nextAnnualIncreaseDate.setFullYear(nextAnnualIncreaseDate.getFullYear() + 1);
        nextAnnualIncreaseDate.setMonth(nextAnnualIncreaseDate.getMonth() - bonusMonths);
        nextAnnualIncreaseDate.setHours(0, 0, 0, 0);
        while (nextAnnualIncreaseDate.getTime() < today.getTime()) {
            nextAnnualIncreaseDate.setFullYear(nextAnnualIncreaseDate.getFullYear() + 1);
        }
        const annualTimeDiff = nextAnnualIncreaseDate.getTime() - today.getTime();
        const annualDaysDiff = Math.ceil(annualTimeDiff / (1000 * 3600 * 24));
        let annualStatus = 'متبقي';
        if (annualDaysDiff <= 0) {
            annualStatus = 'مستحقة الآن';
        }
        let promotionStatus = 'غير متاحة';
        let promotionDaysDiff = 0;
        if (nextPromotionDate) {
            const promotionTimeDiff = nextPromotionDate.getTime() - today.getTime();
            promotionDaysDiff = Math.ceil(promotionTimeDiff / (1000 * 3600 * 24));
            promotionStatus = 'متبقي';
            if (promotionDaysDiff <= 0) {
                promotionStatus = 'مستحقة الآن';
            }
        }
        return {
            type: 'regular',
            originalYears,
            bonusMonths,
            nextAnnualIncreaseDate: nextAnnualIncreaseDate,
            annualStatus: annualStatus,
            annualDaysRemaining: annualDaysDiff,
            nextPromotionDate: nextPromotionDate,
            promotionStatus: promotionStatus,
            promotionDaysRemaining: promotionDaysDiff,
            yearsToPromotion: effectiveYears,
            promotionOverdueYears: promotionOverdueYears,
            nextGrade: nextGrade,
            nextStage: nextStage,
            currentStage: currentStage
        };
    }

    function getRatePerHoure(grade) {
        if (parseInt(grade) >= 5 && parseInt(grade) <= 10) {
            return OVERTIME_RATES.low_grade;
        } else if (parseInt(grade) >= 1 && parseInt(grade) <= 4) {
            return OVERTIME_RATES.high_grade;
        } else if (LEADERSHIP_GRADES.includes(grade)) {
            return OVERTIME_RATES.leadership;
        }
        return 0;
    }

    function calculateFullSalary(targetGrade, targetStage, degree, workType, social, kids, positionFactor, bonusMonths, workShift, overtimeHoursInput, shifts) {
        const stageIncrement = stageAddLogic(targetGrade);
        let nominal = gradeBase[targetGrade] + ((targetStage - 1) * stageIncrement);
        if (gradeMaxNominal[targetGrade] && nominal > gradeMaxNominal[targetGrade]) {
            nominal = gradeMaxNominal[targetGrade];
        }
        let certFactor;
        switch (degree) {
            case 'primary': certFactor = 0.20; break;
            case 'preparatory': certFactor = 0.25; break;
            case 'diploma': certFactor = 0.35; break;
            case 'bachelor': certFactor = 0.45; break;
            case 'master': certFactor = 0.65; break;
            case 'phd': certFactor = 0.75; break;
            default: certFactor = 0;
        }
        const riskFactor = workType === 'field' ? 0.3 : 0.25;
        let conditionalFactor = 0;
        if (degree !== 'diploma' && degree !== 'primary' && degree !== 'preparatory') {
            conditionalFactor = workType === 'field' ? 0.50 : 0.35;
        }
        const fixedOtherAllowanceFactor = 0.3;
        const totalFactors = certFactor + riskFactor + conditionalFactor + fixedOtherAllowanceFactor;
        const factoredAllowance = Math.round(nominal * totalFactors);
        let familyAllowance = 0;
        if (social === "married") {
            familyAllowance = 50000 + kids * 10000;
        }
        const responsibilityAllowance = Math.round(nominal * positionFactor);
        const bonusAmount = 0;
        let specialAllowance = 0;
        let specialAllowanceDetails = { type: 'None', hours: 0, rate: 0, shiftList: '' };
        const ratePerHoure = getRatePerHoure(targetGrade);
        if (workShift === 'morning' && overtimeHoursInput > 0) {
            specialAllowance = overtimeHoursInput * ratePerHoure;
            specialAllowanceDetails.type = 'Overtime';
            specialAllowanceDetails.hours = overtimeHoursInput;
            specialAllowanceDetails.rate = ratePerHoure;
        } else if (workShift === 'shift') {
            let hours = 0;
            const shiftRate = 4000;
            if (shifts === 'authorized') {
                hours = 22.5;
            } else {
                hours = 26;
            }
            specialAllowance = hours * shiftRate;
            specialAllowanceDetails.type = 'Shift';
            specialAllowanceDetails.hours = hours;
            specialAllowanceDetails.rate = shiftRate;
            specialAllowanceDetails.shiftList = shifts === 'authorized' ? 'مجاز' : 'غير مجاز';
        }
        const retirement = Math.round(0.1 * nominal);
        const fixedDeductions = DEDUCTIONS.HEALTH_INSURANCE + DEDUCTIONS.SOCIAL_SOLIDARITY + DEDUCTIONS.CHILD_HOSPITAL_SUPPORT + DEDUCTIONS.PREVIOUS_DEDUCTION;
        const totalDeductions = retirement + fixedDeductions;
        const grossBeforeDeductions = nominal + factoredAllowance + familyAllowance + responsibilityAllowance + specialAllowance;
        const netAfterDeductions = grossBeforeDeductions - totalDeductions;
        const totalSalary = netAfterDeductions + LOCATION_FIXED_BONUS;
        return { nominal, totalSalary, responsibilityAllowance, totalDeductions, bonusAmount, factoredAllowance, specialAllowance, specialAllowanceDetails };
    }

    function calculateServiceDuration(startDate) {
        if (!startDate) return null;
        const start = new Date(startDate);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();
        if (days < 0) {
            months--;
            const daysInPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += daysInPreviousMonth;
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        if (years < 0) {
            return "تاريخ تعيين غير صحيح";
        }
        return { years, months, days };
    }

    function todayISO() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    function initDateInputs() {
        document.getElementById('dateOfAppointment').value = todayISO();
        document.getElementById('lastPromotionDate').value = todayISO();
    }

    const DEGREE_RANGES = {
        'primary': { min: 10, max: 3 },
        'preparatory': { min: 10, max: 2 },
        'diploma': { min: 8, max: 1 },
        'bachelor': { min: 7, max: 1 },
        'master': { min: 7, max: 1 },
        'phd': { min: 7, max: 1 }
    };

    const LEADERSHIP_OPTIONS = [
        { value: 'GM', text: 'المدير العام ومن بدرجته' },
        { value: 'SP', text: 'الدرجة الخاصة' },
        { value: 'UM', text: 'وكيل وزارة ومن بدرجته' }
    ];

    function updateGradeOptions() {
        const degree = document.getElementById('degreeType').value;
        const position = document.getElementById('position').value;
        const gradeSelect = document.getElementById('grade');
        const currentGrade = gradeSelect.value;
        gradeSelect.innerHTML = '';
        const range = DEGREE_RANGES[degree];
        if (!range) return;
        for (let g = range.min; g >= range.max; g--) {
            const option = document.createElement('option');
            option.value = String(g);
            option.textContent = String(g);
            gradeSelect.appendChild(option);
        }
        if (position !== 'none') {
            LEADERSHIP_OPTIONS.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                gradeSelect.appendChild(option);
            });
        }
        const availableValues = Array.from(gradeSelect.options).map(o => o.value);
        if (availableValues.includes(currentGrade)) {
            gradeSelect.value = currentGrade;
        } else {
            gradeSelect.value = String(range.min);
        }
        updateStageVisibility();
    }

    function updateStageVisibility() {
        const grade = document.getElementById('grade').value;
        const stageBox = document.getElementById('stageBox');
        if (LEADERSHIP_GRADES.includes(grade)) {
            stageBox.classList.add('hidden');
        } else {
            stageBox.classList.remove('hidden');
        }
    }

    function toggleKids() {
        document.getElementById("kidsBox").classList.toggle(
            "hidden",
            document.getElementById("social").value !== "married"
        );
    }

    function toggleShiftsAndOvertime() {
        const workShift = document.getElementById("workShift").value;
        document.getElementById("overtimeHoursBox").classList.toggle("hidden", workShift !== 'morning');
        document.getElementById("shiftsBox").classList.toggle("hidden", workShift !== 'shift');
    }

    function calculateAll() {
        document.getElementById('loadingIndicator').style.display = 'block';
        document.querySelectorAll('.result').forEach(el => el.classList.add('hidden'));
        document.getElementById("detailsBox").classList.add('hidden');
        document.getElementById("printBtn").style.display = 'none';
        setTimeout(() => {
            const dateOfAppointmentInput = document.getElementById("dateOfAppointment").value.trim();
            const lastPromotionDateInput = document.getElementById("lastPromotionDate").value.trim();
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateOfAppointmentInput && !dateRegex.test(dateOfAppointmentInput)) {
                alert("صيغة تاريخ التعيين غير صحيحة. يجب أن تكون YYYY-MM-DD.");
                document.getElementById('loadingIndicator').style.display = 'none';
                return;
            }
            if (lastPromotionDateInput && !dateRegex.test(lastPromotionDateInput)) {
                alert("صيغة تاريخ آخر ترقية/علاوة غير صحيحة. يجب أن تكون YYYY-MM-DD.");
                document.getElementById('loadingIndicator').style.display = 'none';
                return;
            }
            const dateOfAppointment = dateOfAppointmentInput;
            const lastPromotionDate = lastPromotionDateInput;
            const grade = document.getElementById("grade").value;
            const isLeadership = LEADERSHIP_GRADES.includes(grade);
            const stage = parseInt(document.getElementById("stage").value) || 1;
            const degree = document.getElementById("degreeType").value;
            const workType = document.getElementById("workType").value;
            const social = document.getElementById("social").value;
            const kids = parseInt(document.getElementById("kids").value) || 0;
            const bonusMonths = parseInt(document.getElementById("bonusMonths").value) || 0;
            const workShift = document.getElementById("workShift").value;
            const overtimeHoursInput = parseInt(document.getElementById("overtimeHoursInput").value) || 0;
            const shifts = document.getElementById("shifts").value;
            let positionFactor = 0;
            const position = document.getElementById("position").value;
            if (grade === 'GM') {
                positionFactor = 0.30;
            } else if (grade === 'SP' || grade === 'UM') {
                positionFactor = 0;
            } else {
                positionFactor = POSITION_DEDUCTIONS[position] || 0;
            }
            const { nominal: currentNominal, totalSalary: currentTotalSalary, responsibilityAllowance, totalDeductions, bonusAmount, factoredAllowance, specialAllowance, specialAllowanceDetails } =
                calculateFullSalary(grade, stage, degree, workType, social, kids, positionFactor, bonusMonths, workShift, overtimeHoursInput, shifts);
            document.getElementById("salaryResult").classList.remove('hidden');
            document.getElementById("salaryResult").innerHTML =
                "الراتب الصافي: <span>" + currentTotalSalary.toLocaleString() + "</span> دينار";
            const service = calculateServiceDuration(dateOfAppointment);
            const serviceElement = document.getElementById("serviceDuration");
            if (service && typeof service !== 'string') {
                serviceElement.innerHTML =
                    ` خدمة فعلية:
                    ${service.years} سنة/ ${service.months} شهر/ ${service.days} يوم `;
                serviceElement.classList.remove('hidden');
            } else if (typeof service === 'string') {
                alert(service);
            }
            const promotionInfo = lastPromotionDate ? calculatePromotions(lastPromotionDate, grade, stage, bonusMonths) : null;
            const degreeText = document.getElementById("degreeType").selectedOptions[0].textContent;
            const gradeText = document.getElementById("grade").selectedOptions[0].textContent;
            const formattedDate = dateOfAppointment ? formatDate(new Date(dateOfAppointment)) : "غير مُدخل";
            const formattedLastPromotionDate = lastPromotionDate ? formatDate(new Date(lastPromotionDate)) : "غير مُدخل";
            let positionText;
            if (isLeadership) {
                positionText = gradeText;
            } else {
                positionText = document.getElementById("position").selectedOptions[0].textContent;
            }
            const workTypeText = document.getElementById("workType").selectedOptions[0].textContent;
            const gradeStageText = `${gradeText} - المرحلة ${stage}`;
            let certFactor = 0;
            switch (degree) {
                case 'primary': certFactor = 0.20; break;
                case 'preparatory': certFactor = 0.25; break;
                case 'diploma': certFactor = 0.35; break;
                case 'bachelor': certFactor = 0.45; break;
                case 'master': certFactor = 0.65; break;
                case 'phd': certFactor = 0.75; break;
                default: certFactor = 0;
            }
            let riskFactor = workType === 'field' ? 0.3 : 0.25;
            let conditionalFactor = 0;
            if (degree !== 'diploma' && degree !== 'primary' && degree !== 'preparatory') {
                conditionalFactor = workType === 'field' ? 0.50 : 0.35;
            }
            let fixedOtherAllowanceFactor = 0.3;
            const certAmount = Math.round(currentNominal * certFactor);
            const riskAmount = Math.round(currentNominal * riskFactor);
            const otherFixedAmount = Math.round(currentNominal * fixedOtherAllowanceFactor);
            const conditionalAmount = Math.round(currentNominal * conditionalFactor);
            let familyAllowance = social === "married" ? (50000 + kids * 10000) : 0;
            const grossSalary = currentTotalSalary + totalDeductions;
            let nextAnnualDateText = "غير مُدخل";
            let annualStatusDisplay = "غير مُدخل";
            let nextPromotionDateText = "غير مُدخل";
            let promotionStatusDisplay = "غير مُدخل";
            if (promotionInfo) {
                if (promotionInfo.type === 'leadership') {
                    nextAnnualDateText = "لا يوجد";
                    annualStatusDisplay = "درجة قيادية";
                    nextPromotionDateText = "لا يوجد";
                    promotionStatusDisplay = "درجة قيادية";
                } else {
                    nextAnnualDateText = formatDate(promotionInfo.nextAnnualIncreaseDate);
                    if (promotionInfo.annualStatus === 'مستحقة الآن') {
                        annualStatusDisplay = "مستحقة الآن";
                    } else {
                        annualStatusDisplay = `${promotionInfo.annualStatus} (${promotionInfo.annualDaysRemaining} يوم)`;
                    }
                    if (promotionInfo.nextPromotionDate) {
                        nextPromotionDateText = formatDate(promotionInfo.nextPromotionDate);
                        if (promotionInfo.promotionOverdueYears > 0) {
                            promotionStatusDisplay = `مستحق ترقية منذ ${promotionInfo.promotionOverdueYears} سنة`;
                        } else if (promotionInfo.promotionStatus === 'مستحقة الآن') {
                            promotionStatusDisplay = "مستحقة الآن";
                        } else {
                            promotionStatusDisplay = `${promotionInfo.promotionStatus} (${promotionInfo.promotionDaysRemaining} يوم )`;
                        }
                    } else {
                        nextPromotionDateText = "لا يوجد";
                        promotionStatusDisplay = "لا يوجد";
                    }
                }
            }
            document.getElementById("detailsBox").innerHTML =
                "<h4>معلومات الموظف</h4>" +
                "<hr style='margin: 5px 0 12px 0; border-top: 1px dashed #ccc;'>" +
                "<ul>" +
                    `<li>تاريخ التعيين: <span>${formattedDate}</span></li>` +
                    `<li>تاريخ آخر ترفيع: <span>${formattedLastPromotionDate}</span></li>` +
                    `<li>الترفيع القادم: <span>${nextPromotionDateText}</span></li>` +
                    `<li>حالة الترفيع: <span>${promotionStatusDisplay}</span></li>` +
                    `<li>العلاوة القادمة: <span>${nextAnnualDateText}</span></li>` +
                    `<li>حالة العلاوة: <span>${annualStatusDisplay}</span></li>` +
                    `<li>موقع العمل: <span>${workTypeText}</span></li>` +
                    `<li>الشهادة: <span>${degreeText}</span></li>` +
                    `<li>الدرجة والمرحلة: <span>${gradeStageText}</span></li>` +
                    `<li>المسؤولية: <span>${positionText}</span></li>` +
                "</ul>" +
                "<h4>مخصصات الراتب</h4>" +
                "<hr style='margin: 5px 0 12px 0; border-top: 1px dashed #ccc;'>" +
                "<ul>" +
                    `<li>الراتب الإسمي: <span>${currentNominal.toLocaleString()}</span> دينار</li>` +
                    `<li>م. شهادة: <span>${certAmount.toLocaleString()}</span> دينار</li>` +
                    `<li>م. خطورة: <span>${riskAmount.toLocaleString()}</span> دينار</li>` +
                    `<li>م. ثابت: <span>${otherFixedAmount.toLocaleString()}</span> دينار</li>` +
                    `<li>م. هندسية: <span>${conditionalAmount.toLocaleString()}</span> دينار</li>` +
                    `<li>م. زوجية وأطفال: <span>${familyAllowance.toLocaleString()}</span> دينار</li>` +
                    `<li>م. موقعية: <span>${LOCATION_FIXED_BONUS.toLocaleString()}</span> دينار</li>` +
                    `<li>م. ساعات اضافية: <span>${specialAllowance.toLocaleString()}</span> دينار</li>` +
                "</ul>" +
                "<hr style='margin: 8px 0; border-top: 1px dashed #ccc;'>" +
                "<strong>الراتب الكلي:</strong> <span>" + grossSalary.toLocaleString() + "</span> دينار<br>" +
                "<strong>الاستقطاعات:</strong> <span>" + totalDeductions.toLocaleString() + "</span> دينار<br>" +
                "<strong>الراتب الصافي:</strong> <span>" + currentTotalSalary.toLocaleString() + "</span> دينار";
            document.getElementById("detailsBox").classList.remove('hidden');
            document.getElementById("printBtn").style.display = 'flex';
            document.getElementById('loadingIndicator').style.display = 'none';
        }, 800);
    }

    function printResults() {
        if (document.getElementById("salaryResult").classList.contains('hidden')) {
            alert("يرجى إجراء عملية الحساب أولاً قبل محاولة الطباعة.");
            return;
        }
        window.print();
    }

    function resetForm() {
        document.getElementById("salaryForm").reset();
        document.getElementById("bonusMonths").value = 0;
        document.getElementById("overtimeHoursInput").value = "";
        initDateInputs();
        document.getElementById("position").value = "none";
        document.getElementById("workShift").value = "morning";
        document.getElementById("shifts").value = "unauthorized";
        document.getElementById("grade").value = "10";
        document.getElementById("stage").value = "1";
        document.getElementById("kidsBox").classList.add('hidden');
        toggleShiftsAndOvertime();
        document.getElementById("printBtn").style.display = 'none';
        document.getElementById('loadingIndicator').style.display = 'none';
        document.querySelectorAll('.result').forEach(el => el.classList.add('hidden'));
        document.getElementById("detailsBox").classList.add('hidden');
        updateGradeOptions();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initDateInputs();
        document.getElementById("social").addEventListener('change', toggleKids);
        document.getElementById("workShift").addEventListener('change', toggleShiftsAndOvertime);
        document.getElementById("calculateBtn").addEventListener('click', calculateAll);
        document.getElementById("resetBtn").addEventListener('click', resetForm);
        document.getElementById("printBtn").addEventListener('click', printResults);
        document.getElementById("degreeType").addEventListener('change', updateGradeOptions);
        document.getElementById("position").addEventListener('change', updateGradeOptions);
        document.getElementById("grade").addEventListener('change', updateStageVisibility);
        toggleKids();
        toggleShiftsAndOvertime();
        updateGradeOptions();
    });

    const clock = document.getElementById('clock');
    const fmt = new Intl.DateTimeFormat('ar-u-ca-gregory', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    function tick() { clock.textContent = fmt.format(new Date()); }
    tick();
    setInterval(tick, 1000);