import { BarcodeScanResult } from "../../../barcode-scanner/types";
import { ProductFormFields } from "../../../product-form";
import useDialog from "../../../use-dialog";

type NewProductDialogPayload = {
    barcodeScanResult: BarcodeScanResult,
    defaultProductFields?: ProductFormFields
};

const useNewProductDialog = () => useDialog<NewProductDialogPayload>();
export default useNewProductDialog;
