import { chromium } from 'playwright-core';

/** Launch a system Chromium-based browser (Edge or Chrome). */
export async function launchBrowser() {
	const errors = [];
	for (const channel of ['msedge', 'chrome']) {
		try {
			return await chromium.launch({ channel });
		} catch (error) {
			errors.push(`${channel}: ${error.message.split('\n')[0]}`);
		}
	}
	throw new Error(`No se encontró Edge ni Chrome.\n${errors.join('\n')}`);
}
