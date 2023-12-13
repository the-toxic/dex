function parseJWT(token: string) {
	try {
		const parts = token.split('.')
		return {
			header: parsePart(parts[0]),
			payload: parsePart(parts[1]),
			sign: parts[2],
		}
	} catch (e) {
		return false
	}
}

function parsePart(str: string) {
	return JSON.parse(window.atob(str))
}

export { parseJWT }
