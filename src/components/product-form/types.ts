type ProductFormData = {
    barcode: string;
    barcodeType: string;
    generalName: string;

    fullName: string | null;
    country: string | null;
    companyName: string | null;
    imageUrl: string | null;
};

export default ProductFormData;
