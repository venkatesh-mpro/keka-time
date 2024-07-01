javascript: (function () {
	async function fetchData() {
		let messages = '꧁༺ MKN Machine ༻꧂\n';
		try {
			const current_time = new Date();
			const TOKEN = `Bearer ${localStorage.getItem('access_token')}`;
			const URL = 'https://mitsogo.keka.com/k/attendance/api/mytime/attendance/summary';
			const response = await fetch(URL, { headers: { Authorization: TOKEN } });
			if (!response.ok) {
				showAlert('Update token', 'Alert');
				return;
			}
			const data = await response.json();
			const yesterdayData = data.data[data.data.length - 1];
			const effective_hours = yesterdayData.totalEffectiveHours;
			const remaining_eff_hours = 8 - effective_hours;
			let last_in_time;
			let first_entry;
			if (
				Math.floor(yesterdayData.originalTimeEntries.length / 2) !== 0 ||
				yesterdayData.originalTimeEntries.length === 1
			) {
				last_in_time = new Date(
					yesterdayData.originalTimeEntries[yesterdayData.originalTimeEntries.length - 1].actualTimestamp
				);
				first_entry = new Date(yesterdayData.originalTimeEntries[0].actualTimestamp);
				const gross_completed_time = new Date(first_entry.getTime() + 9 * 60 * 60 * 1000);
				const eff_completed_time = new Date(last_in_time.getTime() + remaining_eff_hours * 60 * 60 * 1000);
				const eff_required = new Date(eff_completed_time.getTime() - current_time.getTime());
				messages += `Entry time ${formatTime(first_entry)}\nEffective time will be completed at ${formatTime(
					eff_completed_time
				)}\nEffective time required ${formatTimeDiff(
					eff_required
				)}\nGross hours will be completed at ${formatTime(gross_completed_time)}`;
				const timeDiff = new Date(
					gross_completed_time.getTime() - eff_completed_time.getTime() + 60 * 60 * 1000
				);
				if (timeDiff.getTime() < 0) {
					messages += `\nExtra break time ${formatTimeDiff(timeDiff)}`;
				} else {
					messages += `\nRemaining break time ${formatTimeDiff(timeDiff)}`;
				}
			} else {
				const eff_completed_time = new Date(current_time.getTime() + remaining_eff_hours * 60 * 60 * 1000);
				messages += `\nWarning: last swipe is not recorded\nEffective hours will be completed at: ${formatTime(
					eff_completed_time
				)}`;
			}
			messages += '\n✨V1P3R✨';
		} catch (exc) {
			messages += `\nError: ${exc}`;
		}
		showAlert(messages, 'Attendance Summary');
	}
	function formatTime(date) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		const ampm = hours >= 12 ? ' PM ' : ' AM ';
		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		const strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
		return strTime;
	}
	function formatTimeDiff(timeDiff) {
		const days = Math.floor(timeDiff.getTime() / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeDiff.getTime() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((timeDiff.getTime() % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDiff.getTime() % (1000 * 60)) / 1000);
		let formattedTime = ' ';
		if (days > 0) {
			formattedTime += `${days}d `;
		}
		if (hours > 0) {
			formattedTime += `${hours}:`;
		}
		if (minutes > 0) {
			formattedTime += `${minutes}:`;
		}
		formattedTime += `${seconds}`;
		return formattedTime;
	}
	function showAlert(message, title) {
		const modal = document.createElement('div');
		const modalContent = document.createElement('div');
		const messageParagraph = document.createElement('p');
		modal.style.position = 'fixed';
		modal.style.zIndex = '1000';
		modal.style.top = '55px';
		modal.style.left = '50%';
		modal.style.transform = 'translateX(-50%)';
		modalContent.style.backgroundColor = 'rgba(171,227,255,1)';
		modalContent.style.padding = '12px 16px';
		modalContent.style.borderRadius = '12px';
		modalContent.style.margin = '0.5rem';
		modalContent.style.marginBottom = '12px';
		modalContent.style.border = '2px solid hsl(var(--color-h),var(--color-s),var(--color-l));';
		modalContent.style.borderStyle = 'solid';
		modalContent.style.borderWidth = '1px';
		modalContent.style.borderColor = 'rgba(126,182,193,1)';
		modalContent.style.fontFamily = 'sans-serif';
		modalContent.style.fontSize = '14px';
		modalContent.style.width = '100%';
		modalContent.style.textAlign = 'center';
		modalContent.style.transition = 'opacity 1.5s';
		messageParagraph.style.color = 'rgba(15,98,138,1)';
		messageParagraph.innerText = message;
		modalContent.appendChild(messageParagraph);
		modal.appendChild(modalContent);
		document.body.appendChild(modal);
		setTimeout(() => {
			modalContent.style.opacity = '0';
			setTimeout(() => document.body.removeChild(modal), 5000);
		}, 5000);
	}
	fetchData();
})();
