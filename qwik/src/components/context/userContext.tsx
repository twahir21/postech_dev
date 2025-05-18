import { createContextId } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";

interface userGlobalData {
    usernameData: Signal<string>
}

export const userGlobal = createContextId<userGlobalData>('user-context')