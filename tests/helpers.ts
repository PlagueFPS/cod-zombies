import { Cause, Exit, Option } from "effect"
import { expect } from "vitest"

export function assertSortedDescByDate(dates: readonly Date[]) {
	for (let i = 0; i < dates.length - 1; i++) {
		expect(dates[i]!.getTime()).toBeGreaterThanOrEqual(dates[i + 1]!.getTime())
	}
}

export function expectExitFailure<A, E>(exit: Exit.Exit<A, E>): Cause.Cause<E> {
	expect(Exit.isFailure(exit)).toBe(true)
	if (Exit.isFailure(exit)) {
		return exit.cause
	}
	expect.fail("expected Exit failure")
}

export function expectExitSuccess<A, E>(exit: Exit.Exit<A, E>): A {
	expect(Exit.isSuccess(exit)).toBe(true)
	if (Exit.isSuccess(exit)) {
		return exit.value
	}
	expect.fail("expected Exit success")
}

export function expectCauseHasString(cause: Cause.Cause<unknown>, substring: string) {
	const msg = Cause.pretty(cause)
	expect(msg).toContain(substring)
}

export function expectCauseTaggedError<E extends { _tag: string }>(
	cause: Cause.Cause<unknown>,
	tag: E["_tag"],
	predicate?: (e: E) => boolean,
): E {
	const opt = Cause.findErrorOption(cause)
	const err = Option.getOrElse(opt, () => {
		expect.fail(`expected tagged error in cause: ${Cause.pretty(cause)}`)
	})
	expect((err as E)._tag).toBe(tag)
	if (predicate && !predicate(err as E)) {
		expect.fail(`predicate failed for ${tag}: ${JSON.stringify(err)}`)
	}
	return err as E
}
