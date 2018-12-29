const SQUAT_WORDS = ['squat']
const BENCH_PRESS_WORDS = ['bench', 'press', 'panca', 'paralimpica']
const DEADLIFT_WORDS = ['deadlift', 'conventional', 'sumo', 'stacco', 'stacchi', 'classico']

const WORDS = [SQUAT_WORDS, BENCH_PRESS_WORDS, DEADLIFT_WORDS]

const WORDS_REGEX = new RegExp('(' + WORDS.flat().join(')|(') + ')', 'gi')

const PERCENTAGE_REGEX = /[0-9]+[,.']*[0-9]* *%/gi

const SQUAT_KEY = 'squat'
const BENCH_PRESS_KEY = 'bench-press'
const DEADLIFT_KEY = 'deadlift'
const KEYS = [SQUAT_KEY, BENCH_PRESS_KEY, DEADLIFT_KEY]

const PROGRAM_KEY = 'program'
const CONVERT_KEY = 'convert'

const SQUAT_INPUT = document.getElementById(SQUAT_KEY)
const BENCH_PRESS_INPUT = document.getElementById(BENCH_PRESS_KEY)
const DEADLIFT_INPUT = document.getElementById(DEADLIFT_KEY)
const INPUTS = [SQUAT_INPUT, BENCH_PRESS_INPUT, DEADLIFT_INPUT]

const PROGRAM_TEXT_AREA = document.getElementById(PROGRAM_KEY)
const CONVERT_BUTTON = document.getElementById(CONVERT_KEY)

const EXPIRY = {expiry : 60 * 60 * 24 * 365}

const parse = (value) => {
	value = parseInt(value) || 0
	return value >= 0 ? value : 0
}

INPUTS.forEach((input, index) => {
	input.value = parse(Cookies.get(KEYS[index]))
	input.onchange = () => Cookies.set(KEYS[index], parse(input.value), EXPIRY)
})

CONVERT_BUTTON.onclick = () => {
	const VALUES = INPUTS.map((input) => parse(input.value))
	const PROGRAM = PROGRAM_TEXT_AREA.value || ''
	
	const findAll = (str, regex) => {
		const MATCHES = []
		let match
		while((match = regex.exec(str)) !== null){
			MATCHES.push(match)
		}
		return MATCHES.map((e) => ({match:e[0], index:e.index}))
	}
	
	const PERCENTAGE_MATCHES = findAll(PROGRAM, PERCENTAGE_REGEX)
	const WORDS_MATCHES = findAll(PROGRAM, WORDS_REGEX)
	
	let newProgram = ''
	let lastIndex = 0
	let lastLift = 0
	PERCENTAGE_MATCHES.forEach((p) => {
		newProgram += PROGRAM.substring(lastIndex, p.index)
		lastIndex = p.index + p.match.length
		
		while(WORDS_MATCHES.length > lastLift + 1 && WORDS_MATCHES[lastLift + 1].index < p.index){
			lastLift++
		}
		let index = WORDS.findIndex((list) => list.includes(WORDS_MATCHES[lastLift].match.toLowerCase()))
		
		let percentage = parseFloat(p.match.replace('%', '').replace(/[,']/, '.')) / 100.0
		let maximum = VALUES[index]
		let value = Math.round(maximum * percentage * 100.0) / 100.0
		percentage = Math.round(percentage * 10000.0) / 100.0
		
		newProgram += percentage + '% ' + value + 'Kg'
		if(PROGRAM.length > lastIndex && PROGRAM[lastIndex] != ' '){
			newProgram += ' '
		}
	})
	
	newProgram += PROGRAM.substring(lastIndex, PROGRAM.length)
	
	PROGRAM_TEXT_AREA.value = newProgram
}
