"use client";

import { cookies } from "next/headers";

export default function TestPage() {
	const callAPI = async () => {
		try {
			const res = await fetch(
				`http://localhost:3001/auth/test`
			);
			const data = await res.json();

			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};
    return <button onClick={callAPI}>Make API Call</button>
}