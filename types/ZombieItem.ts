import type { Entry } from "contentful";
import type { TypeAmmoModsSkeleton, TypeGobblegumsSkeleton, TypePerksSkeleton, TypeFieldUpgradesSkeleton } from "@/contentful/Types/contentful-types";

export type ZombieItem = Entry<TypeAmmoModsSkeleton, undefined, string> | Entry<TypeFieldUpgradesSkeleton, undefined, string> 
    | Entry<TypeGobblegumsSkeleton, undefined, string> | Entry<TypePerksSkeleton, undefined, string>