export type Player = {
    playerid: string;
    firstname: string;
    lastname: string;
}

export type PlayerRecord = {
    id: string;
    playerid: string;
    firstname: string;
    lastname: string;
    club: string;
    position: string;
    basesalary: number;
    guaranteedcomp: number;
    recordyear: string;
    recordseason: string; 
}

export type Club = {
    clubid: string;
    clubname: string;
    yearfirst: string;
    yearfinal: string;
    colorprimary: string;
    colorsecondary: string;
}