"use client"

import { ColumnDef } from "@tanstack/react-table"

export type TablePlayer = {
    id: string;
    name: string;
    club: string;
    position: string;
    baseSal: string;
    guarComp: string;
}

export const playerColumns: ColumnDef<TablePlayer>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "club",
        header: "Club",
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        accessorKey: "baseSal",
        header: "Base Salary",
    },
    {
        accessorKey: "guarComp",
        header: "Guaranteed Comp",
    },
]