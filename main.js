// Consolidated app logic for Daily Preparation Tracker

// --- Helpers ---
function updateSlider(slider, labelId) {
  const el = typeof slider === 'string' ? document.getElementById(slider) : slider;
  const label = document.getElementById(labelId);
  if (!el || !label) return;
  label.textContent = el.value + ' / 10';
}

function getFormValue(id, type = 'text') {
  const el = document.getElementById(id);
  if (!el) return type === 'number' ? 0 : '';
  const v = el.value;
  if (type === 'number') {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  return v;
}

function getCheckedValue(name, fallback = 'no') {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : fallback;
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem('dailyTrackerEntries') || '[]');
  } catch (e) {
    console.error('Failed to load entries', e);
    return [];
  }
}

// --- Save / Reset / Export ---
function saveEntry() {
  const dateValue = getFormValue('date');
  if (!dateValue) { alert('Please choose a date before saving.'); return; }

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

  const entries = loadEntries();
  const existingIndex = entries.findIndex(e => e.date === entry.date);
  if (existingIndex !== -1) entries[existingIndex] = entry; else entries.push(entry);
  entries.sort((a,b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem('dailyTrackerEntries', JSON.stringify(entries));

  resetForm();
  updateHistory();
  updateAnalytics();
  alert('🎉 Entry saved successfully!');
}

function resetForm() {
  const dateEl = document.getElementById('date');
  if (dateEl) dateEl.valueAsDate = new Date();

  document.querySelectorAll('input[type="number"], input[type="text"], textarea').forEach(el => el.value = '');
  document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
  document.querySelectorAll('select').forEach(el => el.value = '');

  const setIf = (id, val, labelId) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
    if (labelId) updateSlider(document.getElementById(id), labelId);
  };

  setIf('energySlider', 7, 'energyValue');
  setIf('focusSlider', 8, 'focusValue');
  setIf('disciplineSlider', 7, 'disciplineValue');
  setIf('dayRatingSlider', 7, 'dayRatingValue');
}

// --- History / View / Delete ---
function viewEntry(index) {
  const entries = loadEntries();
  const entry = entries[index];
  if (!entry) return;

  const setIf = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value === undefined ? '' : value;
  };

  setIf('date', entry.date || '');
  setIf('morningStudy', entry.morningStudy || '');
  setIf('schoolFocus', entry.schoolFocus || '');
  setIf('dppPractice', entry.dppPractice || '');
  setIf('pwLectures', entry.pwLectures || '');
  setIf('nightStudy', entry.nightStudy || '');

  setIf('physicsQ', entry.physicsQ || '');
  setIf('chemistryQ', entry.chemistryQ || '');
  setIf('mathsQ', entry.mathsQ || '');
  setIf('maxTimeQ', entry.maxTimeQ || '');

  setIf('class11Subject', entry.class11Subject || '');
  setIf('class11Topic', entry.class11Topic || '');
  setIf('class11Questions', entry.class11Questions || '');

  setIf('boardSubject', entry.boardSubject || '');
  setIf('boardWork', entry.boardWork || '');
  setIf('vocabWords', entry.vocabWords || '');
  setIf('lrQuestions', entry.lrQuestions || '');

  setIf('mockName', entry.mockName || '');
  setIf('mockScore', entry.mockScore || '');
  setIf('mockAccuracy', entry.mockAccuracy || '');
  setIf('mockWeakestSection', entry.mockWeakestSection || '');

  setIf('phoneUsage', entry.phoneUsage || '');
  setIf('unplannedBreaks', entry.unplannedBreaks || '');
  setIf('socialMediaTime', entry.socialMediaTime || '');

  setIf('sleepHours', entry.sleepHours || '');
  setIf('sleepQuality', entry.sleepQuality || '');

  setIf('questionsAttempted', entry.questionsAttempted || '');
  setIf('questionsCorrect', entry.questionsCorrect || '');
  setIf('questionsAccuracy', entry.questionsAccuracy || '');

  setIf('wastedTopic', entry.wastedTopic || '');
  setIf('timeWasted', entry.timeWasted || '');
  setIf('whyStuck', entry.whyStuck || '');

  setIf('mentorScore', entry.mentorScore || '');
  setIf('motivationThought', entry.motivationThought || '');
  setIf('revisionDone', entry.revisionDone || '');
  setIf('learned', entry.learned || '');
  setIf('biggestProblem', entry.biggestProblem || '');

  setIf('priority1', entry.priority1 || '');
  setIf('priority2', entry.priority2 || '');
  setIf('priority3', entry.priority3 || '');

  // radios
  if (entry.conceptDone === 'yes') document.getElementById('conceptYes')?.setAttribute('checked', 'checked');
  else document.getElementById('conceptNo')?.setAttribute('checked', 'checked');

  if (entry.article === 'yes') document.getElementById('articleYes')?.setAttribute('checked', 'checked');
  else document.getElementById('articleNo')?.setAttribute('checked', 'checked');

  if (entry.rc === 'yes') document.getElementById('rcYes')?.setAttribute('checked', 'checked');
  else document.getElementById('rcNo')?.setAttribute('checked', 'checked');

  if (entry.slotProtected === 'yes') document.getElementById('slotYes')?.setAttribute('checked', 'checked');
  else document.getElementById('slotNo')?.setAttribute('checked', 'checked');

  // sliders
  const setSlider = (id, val, label) => {
    const s = document.getElementById(id);
    if (s) s.value = val || 7;
    if (label) updateSlider(document.getElementById(id), label);
  };

  setSlider('energySlider', entry.energy, 'energyValue');
  setSlider('focusSlider', entry.focus, 'focusValue');
  setSlider('disciplineSlider', entry.discipline, 'disciplineValue');
  setSlider('dayRatingSlider', entry.dayRating, 'dayRatingValue');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteEntry(index) {
  const entries = loadEntries();
  if (!entries[index]) return;
  if (!confirm('Delete this entry? This cannot be undone.')) return;
  entries.splice(index, 1);
  localStorage.setItem('dailyTrackerEntries', JSON.stringify(entries));
  updateHistory();
  updateAnalytics();
}

// --- History renderer ---
function updateHistory() {
  const entries = loadEntries();
  const container = document.getElementById('historyContent');
  if (!container) return;
  if (!entries.length) { container.innerHTML = '<p class="note">No entries yet. Add your first daily record above.</p>'; return; }

  container.innerHTML = entries.slice().reverse().map((entry, idx) => {
    const actualIndex = entries.length - 1 - idx;
    const totalStudy = ((Number(entry.morningStudy)||0) + (Number(entry.schoolFocus)||0) + (Number(entry.dppPractice)||0) + (Number(entry.pwLectures)||0) + (Number(entry.nightStudy)||0)).toFixed(1);
    const totalQuestions = (Number(entry.physicsQ)||0) + (Number(entry.chemistryQ)||0) + (Number(entry.mathsQ)||0);
    return `\n      <article class="history-entry">\n        <div class="history-header">\n          <div>\n            <div class="history-label">${entry.date||'No date'}</div>\n            <div class="history-value">Day rating ${entry.dayRating||'—'} / 10</div>\n          </div>\n          <div style="display:flex; gap:8px;">\n            <button class="btn-secondary" type="button" onclick="viewEntry(${actualIndex})" style="padding:8px 14px; font-size:0.9rem;">View</button>\n            <button class="btn-secondary" type="button" onclick="deleteEntry(${actualIndex})" style="padding:8px 14px; font-size:0.9rem; color:var(--danger); border-color: rgba(197,48,48,0.3);">Delete</button>\n          </div>\n        </div>\n        <div class="history-row">\n          <div>\n            <div class="history-label">Total study time</div>\n            <div class="history-value">${totalStudy} hrs</div>\n          </div>\n          <div>\n            <div class="history-label">Questions completed</div>\n            <div class="history-value">${totalQuestions}</div>\n          </div>\n          <div>\n            <div class="history-label">GPT mentor score</div>\n            <div class="history-value">${entry.mentorScore||'—'} / 10</div>\n          </div>\n          <div>\n            <div class="history-label">Protected slot</div>\n            <div class="history-value">${entry.slotProtected === 'yes' ? 'Yes' : 'No'}</div>\n          </div>\n        </div>\n        ${entry.motivationThought ? `<p class="note">“${entry.motivationThought}”</p>` : ''}\n      </article>`;
  }).join('');
}

// --- Analytics ---
function updateAnalytics() {
  const entries = loadEntries();
  const totalEntriesEl = document.getElementById('totalEntries');
  const avgStudyTimeEl = document.getElementById('avgStudyTime');
  const avgDayRatingEl = document.getElementById('avgDayRating');
  const avgFocusEl = document.getElementById('avgFocus');
  const slotProtectionRateEl = document.getElementById('slotProtectionRate');
  const class11ConsistencyEl = document.getElementById('class11Consistency');
  const insightsContentEl = document.getElementById('insightsContent');
  const productivityScoreEl = document.getElementById('productivityScore');
  const studyStreakEl = document.getElementById('studyStreak');

  const entriesCount = entries.length;
  if (totalEntriesEl) totalEntriesEl.textContent = String(entriesCount);

  if (!entriesCount) {
    if (avgStudyTimeEl) avgStudyTimeEl.textContent = '0.0';
    if (avgDayRatingEl) avgDayRatingEl.textContent = '0.0';
    if (avgFocusEl) avgFocusEl.textContent = '0.0';
    if (slotProtectionRateEl) slotProtectionRateEl.textContent = '0%';
    if (class11ConsistencyEl) class11ConsistencyEl.textContent = '0%';
    if (insightsContentEl) insightsContentEl.textContent = 'Save a few entries to begin seeing automatic guidance.';
    if (productivityScoreEl) productivityScoreEl.textContent = '0 / 100';
    if (studyStreakEl) studyStreakEl.textContent = '0 Days';
    updateStudyProgress(0);
    renderChart(entries);
    return;
  }

  const totalStudyArr = entries.map(e => ((Number(e.morningStudy)||0) + (Number(e.schoolFocus)||0) + (Number(e.dppPractice)||0) + (Number(e.pwLectures)||0) + (Number(e.nightStudy)||0)));
  const avgStudyTime = (totalStudyArr.reduce((a,b)=>a+b,0) / entriesCount).toFixed(1);
  const avgDayRating = (entries.reduce((a,b)=>a + (Number(b.dayRating)||0),0) / entriesCount).toFixed(1);
  const avgFocus = (entries.reduce((a,b)=>a + (Number(b.focus)||0),0) / entriesCount).toFixed(1);
  const slotProtectedPct = Math.round((entries.filter(e=>e.slotProtected==='yes').length / entriesCount) * 100);
  const class11Count = entries.filter(e => e.class11Subject && e.class11Subject !== '').length;
  const class11Consistency = Math.round((class11Count / entriesCount) * 100);

  if (avgStudyTimeEl) avgStudyTimeEl.textContent = avgStudyTime;
  if (avgDayRatingEl) avgDayRatingEl.textContent = avgDayRating;
  if (avgFocusEl) avgFocusEl.textContent = avgFocus;
  if (slotProtectionRateEl) slotProtectionRateEl.textContent = `${slotProtectedPct}%`;
  if (class11ConsistencyEl) class11ConsistencyEl.textContent = `${class11Consistency}%`;

  if (productivityScoreEl) {
    const latest = entries[entries.length - 1];
    const productivity = calculateProductivity(latest);
    productivityScoreEl.textContent = `${productivity} / 100`;
  }

  if (studyStreakEl) studyStreakEl.textContent = `${calculateStreak(entries)} Days`;

  const insights = [];
  if (Number(avgStudyTime) < 5) {
    insights.push('Focus on a stronger study rhythm: target 5–6 hours of productive work daily.');
  } else {
    insights.push('You are maintaining solid study volume. Keep this momentum.');
  }
  if (slotProtectedPct < 60) {
    insights.push('Protect the 2:00–3:30 PM slot more consistently for focused practice.');
  }
  if (class11Consistency < 50) {
    insights.push('Class 11 recovery should be prioritized daily. Use one dedicated slot for this work.');
  }
  if (Number(avgDayRating) < 7) {
    insights.push('Your average day rating shows room to stabilize your routine. Identify the top blocker each evening.');
  }

  if (insightsContentEl) insightsContentEl.innerHTML = insights.map(text => `<p class="note">• ${text}</p>`).join('');

  updateStudyProgress(Number(totalStudyArr[totalStudyArr.length - 1] || 0));
  renderChart(entries);
}

function calculateProductivity(entry) {
  const studyHours = (Number(entry.morningStudy)||0) + (Number(entry.schoolFocus)||0) + (Number(entry.dppPractice)||0) + (Number(entry.pwLectures)||0) + (Number(entry.nightStudy)||0);
  let score = 0;
  score += Math.min(studyHours * 5, 40);
  score += Math.min(((Number(entry.physicsQ)||0) + (Number(entry.chemistryQ)||0) + (Number(entry.mathsQ)||0)) / 5, 25);
  score += Number(entry.focus) || 0;
  score += Number(entry.discipline) || 0;
  score += Math.min(Number(entry.sleepHours)||0, 8);
  return Math.round(score);
}

function calculateStreak(entries) {
  if (!entries.length) return 0;
  let streak = 1;
  for (let i = entries.length - 1; i > 0; i--) {
    const current = new Date(entries[i].date);
    const previous = new Date(entries[i-1].date);
    const diffDays = Math.round((current - previous) / (1000*60*60*24));
    if (diffDays === 1) streak += 1; else break;
  }
  return streak;
}

function autoCalculateAccuracy() {
  const attempted = parseFloat(document.getElementById('questionsAttempted')?.value) || 0;
  const correct = parseFloat(document.getElementById('questionsCorrect')?.value) || 0;
  const accuracyEl = document.getElementById('questionsAccuracy');
  if (!accuracyEl) return;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
  accuracyEl.value = accuracy.toFixed(1);
}

function updateStudyProgress(totalStudy) {
  const progressEl = document.getElementById('studyProgress');
  if (!progressEl) return;
  const goal = 10;
  const width = Math.min((totalStudy / goal) * 100, 100);
  progressEl.style.width = `${width}%`;
}

let studyChartInstance = null;
function renderChart(entries) {
  const ctx = document.getElementById('studyChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const labels = entries.map(e => e.date);
  const studyHours = entries.map(e => ((Number(e.morningStudy)||0) + (Number(e.schoolFocus)||0) + (Number(e.dppPractice)||0) + (Number(e.pwLectures)||0) + (Number(e.nightStudy)||0)));

  if (studyChartInstance) studyChartInstance.destroy();
  studyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Study Hours',
        data: studyHours,
        borderColor: 'rgba(67, 56, 202, 0.85)',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: 'rgba(226,232,240,0.5)' } } }
    }
  });
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('trackerTheme', isDark ? 'dark' : 'light');
}

function loadQuote() {
  const quotes = [
    'Discipline creates freedom.',
    'Small daily progress compounds into massive success.',
    'Consistency beats motivation.',
    'Every question solved is one step closer to IIT.',
    'Focus on systems, not emotions.'
  ];
  const quoteBox = document.getElementById('quoteBox');
  if (!quoteBox) return;
  const random = Math.floor(Math.random() * quotes.length);
  quoteBox.textContent = quotes[random];
}

function updateClock() {
  const liveClock = document.getElementById('liveClock');
  if (!liveClock) return;
  liveClock.textContent = new Date().toLocaleTimeString();
}

// --- Export & Clipboard ---
function exportData() {
  const entries = loadEntries();
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `daily-tracker-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function copyAllData() {
  const entries = loadEntries();
  let textToCopy = '';
  if (entries && entries.length > 0) textToCopy = JSON.stringify(entries, null, 2);
  else {
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
      conceptDone: getCheckedValue('concept','no'),
      class11Questions: getFormValue('class11Questions','number'),
      boardSubject: getFormValue('boardSubject'),
      boardWork: getFormValue('boardWork'),
      article: getCheckedValue('article','no'),
      rc: getCheckedValue('rc','no'),
      vocabWords: getFormValue('vocabWords','number'),
      lrQuestions: getFormValue('lrQuestions','number'),
      mockName: getFormValue('mockName'),
      mockScore: getFormValue('mockScore','number'),
      mockAccuracy: getFormValue('mockAccuracy','number'),
      mockWeakestSection: getFormValue('mockWeakestSection'),
      phoneUsage: getFormValue('phoneUsage','number'),
      unplannedBreaks: getFormValue('unplannedBreaks','number'),
      socialMediaTime: getFormValue('socialMediaTime','number'),
      sleepHours: getFormValue('sleepHours','number'),
      sleepQuality: getFormValue('sleepQuality','number'),
      questionsAttempted: getFormValue('questionsAttempted','number'),
      questionsCorrect: getFormValue('questionsCorrect','number'),
      questionsAccuracy: getFormValue('questionsAccuracy','number'),
      wastedTopic: getFormValue('wastedTopic'),
      timeWasted: getFormValue('timeWasted','number'),
      whyStuck: getFormValue('whyStuck'),
      mentorScore: getFormValue('mentorScore','number'),
      motivationThought: getFormValue('motivationThought'),
      revisionDone: getFormValue('revisionDone'),
      learned: getFormValue('learned'),
      biggestProblem: getFormValue('biggestProblem'),
      priority1: getFormValue('priority1'),
      priority2: getFormValue('priority2'),
      priority3: getFormValue('priority3'),
      energy: getFormValue('energySlider','number'),
      focus: getFormValue('focusSlider','number'),
      discipline: getFormValue('disciplineSlider','number'),
      slotProtected: getCheckedValue('slotProtection','no'),
      dayRating: getFormValue('dayRatingSlider','number')
    };

    const hasContent = currentEntry.class11Topic || currentEntry.mockName || currentEntry.learned || currentEntry.whyStuck || currentEntry.physicsQ > 0 || currentEntry.morningStudy > 0;
    if (hasContent) textToCopy = JSON.stringify([currentEntry], null, 2);
  }

  if (!textToCopy || textToCopy === '[]') { alert('There is no data to copy! Please fill out the form or save an entry first.'); return; }

  if (!navigator.clipboard) {
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy; textarea.style.position = 'fixed'; textarea.style.opacity = '0'; document.body.appendChild(textarea);
    textarea.focus(); textarea.select();
    try { document.execCommand('copy'); alert('Data copied to clipboard successfully!'); } catch (err) { alert('Failed to copy data.'); }
    document.body.removeChild(textarea); return;
  }

  navigator.clipboard.writeText(textToCopy).then(()=> alert('📋 All data copied to clipboard successfully!')).catch(()=> alert('Unable to copy. Please try again.'));
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
  // set default date
  const dateEl = document.getElementById('date'); if (dateEl && !dateEl.value) dateEl.valueAsDate = new Date();

  // initialize slider labels
  ['energy','focus','discipline','dayRating'].forEach(key => {
    const slider = document.getElementById(key + 'Slider');
    const label = document.getElementById(key + 'Value');
    if (slider && label) updateSlider(slider, key + 'Value');
  });

  // attach button handlers if present
  document.getElementById('saveBtn')?.addEventListener('click', saveEntry);
  document.getElementById('resetBtn')?.addEventListener('click', resetForm);
  document.getElementById('exportBtn')?.addEventListener('click', exportData);
  document.getElementById('copyBtn')?.addEventListener('click', copyAllData);

  updateHistory();
  updateAnalytics();
});