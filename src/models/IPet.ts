import { PetCategory } from "../enums/PetCategory";

export interface IPet {
    id: number,
    category: PetCategory,
    breed: string,
    image?: string,
    height?: number,
    isLongMeasure?: boolean,
    weight?: number,
    color?: String,
    lifeExpectancy?: number,
    shortDescription?: string,
    description?: string,
    price?: number
}