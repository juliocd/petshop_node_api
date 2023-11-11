import { PetCategory } from "./enums/PetCategory";

export interface IPet {
    id: number;
    category: PetCategory;
    name: string;
    price: number;
    color?: string;
}