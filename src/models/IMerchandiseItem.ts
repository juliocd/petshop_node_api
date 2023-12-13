import { MerchandiseCategory } from "../enums/MerchandiseCategory";
import { PetCategory } from "../enums/PetCategory";

export interface IMerchandiseItem {
    id: number,
    image: string,
    name: string,
    desciption: string,
    price: number,
    category: MerchandiseCategory,
    petCategory: PetCategory
}