import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/product';

export const products: Product[] = [
  {
    id: uuidv4(),
    name: 'Phone',
    description:
      '<h4>New jPhone X8600r </h4><p> Snapdragon 8400 / 32GB Ram / 128GB Storage / 48mp Camera </p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
    price: 850,
  },
  {
    id: uuidv4(),
    name: 'Laptop',
    description:
      '<h4>Fell Kostro 3500 </h4><p>Intel i7 4500 / 64GB Ram / 1TB SDD </p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
    price: 1250,
  },
  {
    id: uuidv4(),
    name: 'TV',
    description:
      '<h4>JG QLED 50"</h4><p> Model: 50750 / SpiderOS 3.0 / Wifi </p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>',
    price: 550,
  },
];
