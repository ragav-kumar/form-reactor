
export const scrollToRef = (ref:any) => window.scrollTo({
	top: ref.current.offsetTop - 57,
	behavior: 'smooth',
});
export const scrollToId = (id:string) => {
	const element = document.getElementById(id);
	window.scrollTo({
		top: element ? element.offsetTop - 57 : 0,
		behavior: 'smooth',
	});
}