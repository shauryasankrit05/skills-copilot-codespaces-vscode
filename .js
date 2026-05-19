// --- Helper Functions ---
function updateSlider(slider, labelId) {
    document.getElementById(labelId).textContent = slider.value + ' / 10';
}

function getFormValue(id, type = 'text') {
    const element = document.getElementById(id);
    if (!element) return type === 'number' ? 0 : '';
    if (type === 'number') {
        return parseFloat(element.value) || 0;
    }
    return element.value;
}

function getCheckedValue(name, fallback = 'no') {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || fallback;
}

function loadEntries() {
    try {
        return JSON.parse(localStorage.getItem('dailyTrackerEntries') || '[]');
    } catch (e) {
        console.error("Error reading localStorage data:", e);
        return [];
    }
}

// --- Save & Update Engine ---
function saveEntry() {
    const dateValue = getFormValue('date');
    
    // Validation: Don't allow saving without a valid date
    if (!dateValue) {
        alert('❌ Error: Please select a valid date before saving.');
        return;
    }
    if (entry.dayRating >= 8) {

    confetti({
        particleCount: 120,
        spread: 80
    });
}

    const entry = {
        date: dateValue,
        morningStudy: getFormValue('morningStudy', 'number'),
        schoolFocus: getFormValue('schoolFocus', 'number'),
        dppPractice: getFormValue('dppPractice', 'number'),
        pwLectures: getFormValue('pwLectures', 'number'),
        nightStudy: getFormValue('nightStudy', 'number'),
        physicsQ: getFormValue('physicsQ', 'number'),
        chemistryQ: getFormValue('chemistryQ', 'number'),
        mathsQ: getFormValue('mathsQ', 'number'),
        maxTimeQ: getFormValue('maxTimeQ', 'number'),
        class11Subject: getFormValue('class11Subject'),
        class11Topic: getFormValue('class11Topic'),
        conceptDone: getCheckedValue('concept', 'no'), // Unified to match form resets
        class11Questions: getFormValue('class11Questions', 'number'),
        boardSubject: getFormValue('boardSubject'),
        boardWork: getFormValue('boardWork'),
        article: getCheckedValue('article', 'no'),
        rc: getCheckedValue('rc', 'no'),
        vocabWords: getFormValue('vocabWords', 'number'),
        lrQuestions: getFormValue('lrQuestions', 'number'),
        mockName: getFormValue('mockName'),
        mockScore: getFormValue('mockScore', 'number'),
        mockAccuracy: getFormValue('mockAccuracy', 'number'),
        mockWeakestSection: getFormValue('mockWeakestSection'),
        phoneUsage: getFormValue('phoneUsage', 'number'),
        unplannedBreaks: getFormValue('unplannedBreaks', 'number'),
        socialMediaTime: getFormValue('socialMediaTime', 'number'),
        sleepHours: getFormValue('sleepHours', 'number'),
        sleepQuality: getFormValue('sleepQuality', 'number'),
        questionsAttempted: getFormValue('questionsAttempted', 'number'),
        questionsCorrect: getFormValue('questionsCorrect', 'number'),
        questionsAccuracy: getFormValue('questionsAccuracy', 'number'),
        wastedTopic: getFormValue('wastedTopic'),
        timeWasted: getFormValue('timeWasted', 'number'),
        whyStuck: getFormValue('whyStuck'),
        mentorScore: getFormValue('mentorScore', 'number'),
        motivationThought: getFormValue('motivationThought'),
        revisionDone: getFormValue('revisionDone'),
        learned: getFormValue('learned'),
        biggestProblem: getFormValue('biggestProblem'),
        priority1: getFormValue('priority1'),
        priority2: getFormValue('priority2'),
        priority3: getFormValue('priority3'),
        energy: getFormValue('energySlider', 'number'),
        focus: getFormValue('focusSlider', 'number'),
        discipline: getFormValue('disciplineSlider', 'number'),
        slotProtected: getCheckedValue('slotProtection', 'no'),
        dayRating: getFormValue('dayRatingSlider', 'number')
    };

    let entries = loadEntries();
    
    // Smart Check: If an entry for this date already exists, overwrite it instead of duplicating
    const existingIndex = entries.findIndex(e => e.date === entry.date);
    if (existingIndex !== -1) {
        entries[existingIndex] = entry;
    } else {
        entries.push(entry);
    }
    
    // Sort entries by date chronologically so history/analytics display correctly
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('dailyTrackerEntries', JSON.stringify(entries));

    resetForm();
    updateHistory();
    updateAnalytics();
    alert('🎉 Entry saved successfully!');
}

// --- Form Management ---
function resetForm() {
    document.getElementById('date').valueAsDate = new Date();
    document.querySelectorAll('input[type="number"], input[type="text"], textarea').forEach(el => el.value = '');
    document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
    document.querySelectorAll('select').forEach(el => el.value = '');
    
    // Reset sliders to original baseline defaults
    document.getElementById('energySlider').value = 7;
    document.getElementById('focusSlider').value = 8;
    document.getElementById('disciplineSlider').value = 7;
    document.getElementById('dayRatingSlider').value = 7;
    
    updateSlider(document.getElementById('energySlider'), 'energyValue');
    updateSlider(document.getElementById('focusSlider'), 'focusValue');
    updateSlider(document.getElementById('disciplineSlider'), 'disciplineValue');
    updateSlider(document.getElementById('dayRatingSlider'), 'dayRatingValue');
}

// --- View Past Entry ---
function viewEntry(index) {
    const entries = loadEntries();
    const entry = entries[index];
    if (!entry) return;

    document.getElementById('date').value = entry.date || '';
    document.getElementById('morningStudy').value = entry.morningStudy || '';
    document.getElementById('schoolFocus').value = entry.schoolFocus || '';
    document.getElementById('dppPractice').value = entry.dppPractice || '';
    document.getElementById('pwLectures').value = entry.pwLectures || '';
    document.getElementById('nightStudy').value = entry.nightStudy || '';
    
    document.getElementById('physicsQ').value = entry.physicsQ || '';
    document.getElementById('chemistryQ').value = entry.chemistryQ || '';
    document.getElementById('mathsQ').value = entry.mathsQ || '';
    document.getElementById('maxTimeQ').value = entry.maxTimeQ || '';
    
    document.getElementById('class11Subject').value = entry.class11Subject || '';
    document.getElementById('class11Topic').value = entry.class11Topic || '';
    document.getElementById('class11Questions').value = entry.class11Questions || '';
    
    document.getElementById('boardSubject').value = entry.boardSubject || '';
    document.getElementById('boardWork').value = entry.boardWork || '';
    document.getElementById('vocabWords').value = entry.vocabWords || '';
    document.getElementById('lrQuestions').value = entry.lrQuestions || '';
    
    document.getElementById('mockName').value = entry.mockName || '';
    document.getElementById('mockScore').value = entry.mockScore || '';
    document.getElementById('mockAccuracy').value = entry.mockAccuracy || '';
    document.getElementById('mockWeakestSection').value = entry.mockWeakestSection || '';
    
    document.getElementById('phoneUsage').value = entry.phoneUsage || '';
    document.getElementById('unplannedBreaks').value = entry.unplannedBreaks || '';
    document.getElementById('socialMediaTime').value = entry.socialMediaTime || '';
    
    document.getElementById('sleepHours').value = entry.sleepHours || '';
    document.getElementById('sleepQuality').value = entry.sleepQuality || '';
    
    document.getElementById('questionsAttempted').value = entry.questionsAttempted || '';
    document.getElementById('questionsCorrect').value = entry.questionsCorrect || '';
    document.getElementById('questionsAccuracy').value = entry.questionsAccuracy || '';
    
    document.getElementById('wastedTopic').value = entry.wastedTopic || '';
    document.getElementById('timeWasted').value = entry.timeWasted || '';
    document.getElementById('whyStuck').value = entry.whyStuck || '';
    
    document.getElementById('mentorScore').value = entry.mentorScore || '';
    document.getElementById('motivationThought').value = entry.motivationThought || '';
    document.getElementById('revisionDone').value = entry.revisionDone || '';
    document.getElementById('learned').value = entry.learned || '';
    document.getElementById('biggestProblem').value = entry.biggestProblem || '';
    
    document.getElementById('priority1').value = entry.priority1 || '';
    document.getElementById('priority2').value = entry.priority2 || '';
    document.getElementById('priority3').value = entry.priority3 || '';

    // Handle Radio Checked States safely
    if (entry.conceptDone === 'yes') document.getElementById('conceptYes').checked = true;
    else if (entry.conceptDone === 'no') document.getElementById('conceptNo').checked = true;
    
    if (entry.article === 'yes') document.getElementById('articleYes').checked = true;
    else if (entry.article === 'no') document.getElementById('articleNo').checked = true;
    
    if (entry.rc === 'yes') document.getElementById('rcYes').checked = true;
    else if (entry.rc === 'no') document.getElementById('rcNo').checked = true;
    
    if (entry.slotProtected === 'yes') document.getElementById('slotYes').checked = true;
    else if (entry.slotProtected === 'no') document.getElementById('slotNo').checked = true;

    document.getElementById('energySlider').value = entry.energy || 7;
    document.getElementById('focusSlider').value = entry.focus || 8;
    document.getElementById('disciplineSlider').value = entry.discipline || 7;
    document.getElementById('dayRatingSlider').value = entry.dayRating || 7;
    
    updateSlider(document.getElementById('energySlider'), 'energyValue');
    updateSlider(document.getElementById('focusSlider'), 'focusValue');
    updateSlider(document.getElementById('disciplineSlider'), 'disciplineValue');
    updateSlider(document.getElementById('dayRatingSlider'), 'dayRatingValue');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- History Render Engine ---
function updateHistory() {
    const entries = loadEntries();
    const container = document.getElementById('historyContent');

    if (!entries.length) {
        container.innerHTML = '<p class="note">No entries yet. Add your first daily record above.</p>';
        return;
    }

    // Render reversed layout so newest logs display first visually
    container.innerHTML = entries.slice().reverse().map((entry, index) => {
        const actualIndex = entries.length - 1 - index;
        const totalStudy = ((entry.morningStudy || 0) + (entry.schoolFocus || 0) + (entry.dppPractice || 0) + (entry.pwLectures || 0) + (entry.nightStudy || 0)).toFixed(1);
        const totalQuestions = (entry.physicsQ || 0) + (entry.chemistryQ || 0) + (entry.mathsQ || 0);
        
        return `
            <article class="history-entry">
                <div class="history-header">
                    <div>
                        <div class="history-label">${entry.date || 'No date'}</div>
                        <div class="history-value">Day rating ${entry.dayRating || 7} / 10</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-secondary" onclick="viewEntry(${actualIndex})" type="button" style="padding: 8px 14px; font-size:0.9rem;">View</button>
                        <button class="btn-secondary" onclick="deleteEntry(${actualIndex})" type="button" style="padding: 8px 14px; font-size:0.9rem; color: var(--danger); border-color: rgba(197, 48, 48, 0.3);">Delete</button>
                    </div>
                </div>
                <div class="history-row">
                    <div>
                        <div class="history-label">Total study time</div>
                        <div class="history-value">${totalStudy} hrs</div>
                    </div>
                    <div>
                        <div class="history-label">Questions completed</div>
                        <div class="history-value">${totalQuestions}</div>
                    </div>
                    <div>
                        <div class="history-label">GPT mentor score</div>
                        <div class="history-value">${entry.mentorScore || '—'} / 10</div>
                    </div>
                    <div>
                        <div class="history-label">Protected slot</div>
                        <div class="history-value">${entry.slotProtected === 'yes' ? 'Yes' : 'No'}</div>
                    </div>
                </div>
                ${entry.motivationThought ? `<p class="note" style="margin-top:10px; font-style: italic;">“${entry.motivationThought}”</p>` : ''}
            </article>
        `;
    }).join('');
}
const streak = calculateStreak(entries);
document.getElementById('studyStreak').textContent = `${streak} Days`;
const latestEntry = entries[entries.length - 1];

const productivity = calculateProductivity(latestEntry);

document.getElementById("productivityScore").textContent =
    `${productivity} / 100`;
    updateStudyProgress(latestEntry);
function deleteEntry(index) {
    if(!confirm("Are you sure you want to permanently delete this log?")) return;
    const entries = loadEntries();
    entries.splice(index, 1);
    localStorage.setItem('dailyTrackerEntries', JSON.stringify(entries));
    updateHistory();
    updateAnalytics();
}

// --- Analytics & Mathematical Fallbacks ---
function updateAnalytics() {
    const entries = loadEntries();
    const totalEntries = entries.length;
    document.getElementById('totalEntries').textContent = totalEntries;
    renderChart(entries);

    if (!totalEntries) {
        document.getElementById('avgStudyTime').textContent = '0.0';
        document.getElementById('avgDayRating').textContent = '0.0';
        document.getElementById('avgFocus').textContent = '0.0';
        document.getElementById('slotProtectionRate').textContent = '0%';
        document.getElementById('class11Consistency').textContent = '0%';
        document.getElementById('insightsContent').textContent = 'Save a few entries to begin seeing automatic guidance.';
        return;
    }

    // Use zero fallbacks (|| 0) across arithmetic loops to prevent NaN faults
    const totalStudy = entries.reduce((sum, entry) => sum + (entry.morningStudy || 0) + (entry.schoolFocus || 0) + (entry.dppPractice || 0) + (entry.pwLectures || 0) + (entry.nightStudy || 0), 0);
    const avgStudy = (totalStudy / totalEntries).toFixed(1);
    const avgDayRating = (entries.reduce((sum, entry) => sum + (entry.dayRating || 7), 0) / totalEntries).toFixed(1);
    const avgFocus = (entries.reduce((sum, entry) => sum + (entry.focus || 8), 0) / totalEntries).toFixed(1);
    const slotCount = entries.filter(entry => entry.slotProtected === 'yes').length;
    const class11Count = entries.filter(entry => entry.class11Subject).length;

    document.getElementById('avgStudyTime').textContent = avgStudy;
    document.getElementById('avgDayRating').textContent = avgDayRating;
    document.getElementById('avgFocus').textContent = avgFocus;
    document.getElementById('slotProtectionRate').textContent = Math.round((slotCount / totalEntries) * 100) + '%';
    document.getElementById('class11Consistency').textContent = Math.round((class11Count / totalEntries) * 100) + '%';

    const insights = [];
    if (avgStudy < 5) {
        insights.push('Focus on a stronger study rhythm: target 5–6 hours of productive work daily.');
    } else {
        insights.push('You are maintaining a solid study volume. Keep your sessions consistent.');
    }
    if ((slotCount / totalEntries) < 0.6) {
        insights.push('Protecting the 2:00–3:30 PM slot is essential for focused practice. Aim for higher consistency.');
    }
    if ((class11Count / totalEntries) < 0.5) {
        insights.push('Class 11 recovery should be prioritized daily. Use one dedicated slot for this work.');
    }
    if (avgDayRating < 7) {
        insights.push('Your average rating suggests room to stabilize your daily routine. Identify the top 1 obstacle each evening.');
    }

    document.getElementById('insightsContent').innerHTML = insights.map(text => `<p class="note">• ${text}</p>`).join('');
}

// --- Data Export Infrastructure ---
function exportData() {
    const entries = loadEntries();
    if(!entries.length) {
        alert("No entries found to export!");
        return;
    }
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DailyTracker_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
}

// --- Clipboard Data Integration ---
function copyAllData() {
    const entries = loadEntries();
    let textToCopy = "";

    if (entries && entries.length > 0) {
        textToCopy = JSON.stringify(entries, null, 2);
    } else {
        // Fallback: If localStorage is empty, try to scrape what they are currently typing in real-time
        const currentEntry = {
            date: getFormValue('date'),
            morningStudy: getFormValue('morningStudy', 'number'),
            schoolFocus: getFormValue('schoolFocus', 'number'),
            dppPractice: getFormValue('dppPractice', 'number'),
            pwLectures: getFormValue('pwLectures', 'number'),
            nightStudy: getFormValue('nightStudy', 'number'),
            physicsQ: getFormValue('physicsQ', 'number'),
            chemistryQ: getFormValue('chemistryQ', 'number'),
            mathsQ: getFormValue('mathsQ', 'number'),
            maxTimeQ: getFormValue('maxTimeQ', 'number'),
            class11Subject: getFormValue('class11Subject'),
            class11Topic: getFormValue('class11Topic'),
            conceptDone: getCheckedValue('concept', 'no'),
            class11Questions: getFormValue('class11Questions', 'number'),
            boardSubject: getFormValue('boardSubject'),
            boardWork: getFormValue('boardWork'),
            article: getCheckedValue('article', 'no'),
            rc: getCheckedValue('rc', 'no'),
            vocabWords: getFormValue('vocabWords', 'number'),
            lrQuestions: getFormValue('lrQuestions', 'number'),
            mockName: getFormValue('mockName'),
            mockScore: getFormValue('mockScore', 'number'),
            mockAccuracy: getFormValue('mockAccuracy', 'number'),
            mockWeakestSection: getFormValue('mockWeakestSection'),
            phoneUsage: getFormValue('phoneUsage', 'number'),
            unplannedBreaks: getFormValue('unplannedBreaks', 'number'),
            socialMediaTime: getFormValue('socialMediaTime', 'number'),
            sleepHours: getFormValue('sleepHours', 'number'),
            sleepQuality: getFormValue('sleepQuality', 'number'),
            questionsAttempted: getFormValue('questionsAttempted', 'number'),
            questionsCorrect: getFormValue('questionsCorrect', 'number'),
            questionsAccuracy: getFormValue('questionsAccuracy', 'number'),
            wastedTopic: getFormValue('wastedTopic'),
            timeWasted: getFormValue('timeWasted', 'number'),
            whyStuck: getFormValue('whyStuck'),
            mentorScore: getFormValue('mentorScore', 'number'),
            motivationThought: getFormValue('motivationThought'),
            revisionDone: getFormValue('revisionDone'),
            learned: getFormValue('learned'),
            biggestProblem: getFormValue('biggestProblem'),
            priority1: getFormValue('priority1'),
            priority2: getFormValue('priority2'),
            priority3: getFormValue('priority3'),
            energy: getFormValue('energySlider', 'number'),
            focus: getFormValue('focusSlider', 'number'),
            discipline: getFormValue('disciplineSlider', 'number'),
            slotProtected: getCheckedValue('slotProtection', 'no'),
            dayRating: getFormValue('dayRatingSlider', 'number')
        };

        const hasContent = currentEntry.class11Topic || currentEntry.mockName || currentEntry.learned || currentEntry.whyStuck || currentEntry.physicsQ > 0 || currentEntry.morningStudy > 0;
        if (hasContent) {
            textToCopy = JSON.stringify([currentEntry], null, 2);
        }
    }

    if (!textToCopy || textToCopy === "[]") {
        alert("There is no data to copy! Please fill out the form or save an entry first.");
        return;
    }

    if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            alert('📋 All data copied to clipboard successfully!');
        } catch (err) {
            alert('Failed to copy data.');
        }
        document.body.removeChild(textarea);
        return;
    }

    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('📋 All data copied to clipboard successfully!'))
        .catch(() => alert('Unable to copy. Please try again.'));
}

// --- Lifecycle Initialization ---
document.addEventListener('DOMContentLoaded', function () {
    resetForm();
    updateHistory();
    updateAnalytics();
});