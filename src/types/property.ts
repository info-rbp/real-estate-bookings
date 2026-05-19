export type Room = {
    id: string;
    name: string;
    photo: string;
    rent: number;
    bond: number;
};

export type RentalType = 'whole_property' | 'room_by_room';
