import { VerifyKeyObjectInput } from 'crypto';
import { ReactNode, SetStateAction, Dispatch } from 'react';
declare global {
  export interface TintometricProps {
    title: string,
    subtitle: string,
    buttonGrid: string,
    buttonList: string,
    colorDetailTitle: string,
    confirmButton: string,
    file: string
  }

  export interface FamilyPickerProps {
    action: (family) => void,
    activeId: number
  }

  export interface DataProps {
    families: Family[],
    productType: {
      id: number,
      name: string,
      slug: string
    }[],
    products: ProductProps[]
  }

  export interface ColorListProps {
    items: ProductProps[] | undefined,
    familyName: string,
    setSelectedColor: function,
    layout?: string
  }

  export interface LabelProps {
    name: string,
    code: string
  }

  interface ProductProps {
    R: number,
    G: number,
    B: number,
    code: string,
    family: number,
    name: string,
    slug: string,
    products?: number[],
    skuId?: number,
    order?: number,
    page?: number,
    image?: string
  }

  interface ColorDetailProps {
    color: ProductProps,
    handleClick: function,
    productTypeSlug: string | undefined,
    colorDetailTitle: string,
    confirmButton: string
  }

  interface EventInterface {
    target: {
      value: string
    }
  }

  interface Family {
    color: string,
    id: number,
    name: string,
    products: number[],
    slug: string
  }

  interface TintometricContextInterface {
    getFamilies: (file: string) => void,
    families: Family[],
    activeFamily: Family | undefined,
    setActiveFamily: (Family) => void,
    products: ProductProps[],
    activeProduct: ProductProps | undefined,
    handleModalClick: (state: boolean) => void,
    modalOpen: boolean,
    /* filteredProducts: any,
    selectedColor: any,
    setSelectedColor: (product: ProductProps) => void,
    setFilteredProducts: (product: ProductProps) => void, */
  }

  //CONTEXT
  export interface ContextChildren {
    children: ReactNode;
  }
}

export interface ApiContextInterface {
  apiGetStores: () => Promise<Store[]>;
}

export type GetStoresFnc = () => Promise<Family[]>;
