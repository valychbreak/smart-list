import Product from "../../../../entity/Product";
import useDialog from "../../../use-dialog/use-dialog";

type ProductDialogPayload = {
    product: Product
};

const useProductDialog = () => useDialog<ProductDialogPayload>();

export default useProductDialog;
