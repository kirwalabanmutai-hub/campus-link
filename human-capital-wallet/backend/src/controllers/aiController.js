import { query } from '../config/database.js'

const CAREER_MATCHES = [
  { role: 'Frontend Developer',    match: 87, type: 'job',         salary: 'Ksh 80,000–120,000', skills: ['React', 'TypeScript', 'CSS'] },
  { role: 'Data Analyst',          match: 74, type: 'internship',  salary: 'Ksh 30,000/month',   skills: ['Python', 'SQL', 'Excel'] },
  { role: 'UI/UX Designer',        match: 68, type: 'gig',         salary: 'Ksh 5,000/project',  skills: ['Figma', 'Prototyping'] },
  { role: 'Backend Engineer',      match: 63, type: 'job',         salary: 'Ksh 90,000–150,000', skills: ['Node.js', 'PostgreSQL', 'Docker'] },
  { role: 'Mobile Developer',      match: 58, type: 'freelance',   salary: 'Ksh 60,000+',        skills: ['Kotlin', 'Android', 'Swift'] },
]

export async function getCareerMatch(req, res, next) {
  try {
    const { rows: skills } = await query(
      'SELECT name, category FROM skills WHERE user_id=$1', [req.user.id]
    )
    res.json({
      success: true,
      data: {
        matches: CAREER_MATCHES,
        userSkills: skills.map(s => s.name),
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (err) { next(err) }
}

export async function getSkillGap(req, res, next) {
  try {
    const { rows: skills } = await query(
      'SELECT name FROM skills WHERE user_id=$1', [req.user.id]
    )
    const userSkillNames = skills.map(s => s.name.toLowerCase())

    const gapAnalysis = [
      {
        targetRole: 'Full Stack Developer',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
        missingSkills: ['Docker', 'TypeScript', 'PostgreSQL'].filter(
          s => !userSkillNames.includes(s.toLowerCase())
        ),
        readiness: Math.min(90, 40 + userSkillNames.length * 5),
      },
      {
        targetRole: 'Data Scientist',
        requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow'],
        missingSkills: ['Machine Learning', 'TensorFlow', 'Statistics'].filter(
          s => !userSkillNames.includes(s.toLowerCase())
        ),
        readiness: Math.min(80, 30 + userSkillNames.length * 4),
      },
    ]

    res.json({ success: true, data: { gapAnalysis, userSkillCount: skills.length } })
  } catch (err) { next(err) }
}

export async function getRoadmap(req, res, next) {
  try {
    const roadmap = [
      { phase: 1, title: 'Foundations',    duration: '4 weeks', tasks: ['Complete online courses', 'Build 2 portfolio projects', 'Set up GitHub profile'] },
      { phase: 2, title: 'Specialisation', duration: '6 weeks', tasks: ['Deep-dive into chosen stack', 'Contribute to open source', 'Start freelance on Upwork'] },
      { phase: 3, title: 'Job Ready',      duration: '4 weeks', tasks: ['Polish resume', 'Apply to 20 companies', 'Prepare for technical interviews'] },
      { phase: 4, title: 'Landing a Role', duration: '2 weeks', tasks: ['Follow-up with recruiters', 'Negotiate offer', 'Onboard at new role'] },
    ]
    res.json({ success: true, data: { roadmap, estimatedWeeks: 16 } })
  } catch (err) { next(err) }
}

export async function getResumeAdvice(req, res, next) {
  try {
    const { resume } = req.body
    const advice = [
      { section: 'Summary',    score: 70, tip: 'Quantify your achievements — add numbers (e.g., "reduced load time by 40%").' },
      { section: 'Skills',     score: 85, tip: 'Group skills by category (Languages, Frameworks, Tools) for readability.' },
      { section: 'Experience', score: 75, tip: 'Use action verbs (Built, Led, Optimized) and bullet points.' },
      { section: 'Education',  score: 90, tip: 'Looks solid. Add relevant coursework if entry-level.' },
    ]
    const overallScore = Math.round(advice.reduce((s, a) => s + a.score, 0) / advice.length)
    res.json({ success: true, data: { advice, overallScore, resumeLength: resume?.length ?? 0 } })
  } catch (err) { next(err) }
}

export async function getInterviewPrep(req, res, next) {
  try {
    const { role } = req.body
    const questions = [
      { type: 'behavioural', question: 'Tell me about a time you resolved a conflict in a team.' },
      { type: 'technical',   question: `What are the key challenges in ${role || 'software development'}?` },
      { type: 'technical',   question: 'Explain the difference between REST and GraphQL.' },
      { type: 'situational', question: 'How would you handle a tight deadline with incomplete requirements?' },
      { type: 'culture',     question: 'What motivates you to work at an early-stage startup?' },
    ]
    const tips = [
      'Use the STAR method (Situation, Task, Action, Result) for behavioural questions.',
      'Research the company\'s recent news and product launches before the interview.',
      'Prepare 3 questions to ask the interviewer about team culture and growth.',
    ]
    res.json({ success: true, data: { role: role || 'Software Engineer', questions, tips } })
  } catch (err) { next(err) }
}
