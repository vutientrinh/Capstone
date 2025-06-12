import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import backendClient from "@/utils/BackendClient";
import { commonStore } from "@/store/reducers";
import { IMGAES_URL } from "@/global-config";

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

export const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    width: "",
    height: "",
    length: "",
    categoryId: "",
    stockQuantity: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        weight: initialData.weight || "",
        width: initialData.width || "",
        height: initialData.height || "",
        length: initialData.length || "",
        categoryId: initialData.category?.id || "",
        stockQuantity: initialData.stockQuantity || "",
      });
    }

    // img
    const fetchImages = async () => {
      if (initialData?.images?.length) {
        const files = await Promise.all(
          initialData.images.map(async (url: any) => {
            const response = await fetch(IMGAES_URL + url);
            const blob = await response.blob();
            return new File([blob], "image.jpg", { type: blob.type });
          })
        );
        setImages(files);
      }
    };

    fetchImages();
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await backendClient.getOptionsCategories();
        setCategories(response.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi load danh mục", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        setImages((prevImages) => [...prevImages, ...files]);
      }
      document.body.removeChild(input);
    });

    input.click();
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const request: any = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      weight: formData.weight,
      width: formData.width,
      height: formData.height,
      length: formData.length,
      categoryId: formData.categoryId,
      stockQuantity: formData.stockQuantity,
      images: images,
    };

    console.log("request", request);
    try {
      const response: any = await backendClient.updateProduct(
        initialData.id,
        request
      );
      if (response) {
        dispatch(
          commonStore.actions.setSuccessMessage("Cập nhật sản phẩm thành công")
        );
        onClose();
      }
    } catch (error) {
      dispatch(commonStore.actions.setErrorMessage("Cập nhật thất bại"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Cập nhật sản phẩm
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Tên sản phẩm */}
          <Grid item xs={12}>
            <TextField
              label="Tên sản phẩm"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Mô tả */}
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              name="description"
              multiline
              rows={3}
              fullWidth
              required
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          {/* Giá và tồn kho */}
          <Grid item xs={6}>
            <TextField
              label="Giá (VND)"
              name="price"
              type="number"
              fullWidth
              required
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tồn kho"
              name="stockQuantity"
              type="number"
              fullWidth
              required
              value={formData.stockQuantity}
              onChange={handleChange}
            />
          </Grid>

          {/* Kích thước */}
          <Grid item xs={3}>
            <TextField
              label="Cân nặng (g)"
              name="weight"
              type="number"
              fullWidth
              value={formData.weight}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Chiều rộng (cm)"
              name="width"
              type="number"
              fullWidth
              value={formData.width}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Chiều cao (cm)"
              name="height"
              type="number"
              fullWidth
              value={formData.height}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Chiều dài (cm)"
              name="length"
              type="number"
              fullWidth
              value={formData.length}
              onChange={handleChange}
            />
          </Grid>

          {/* Danh mục */}
          <Grid item xs={12}>
            <TextField
              select
              name="categoryId"
              label="Danh mục"
              fullWidth
              required
              value={formData.categoryId}
              onChange={handleChange}
            >
              <MenuItem value="">-- Chọn danh mục --</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Hình ảnh */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Hình ảnh sản phẩm
            </Typography>
            <Button variant="outlined" onClick={handleUploadClick}>
              Tải ảnh lên
            </Button>
            <Grid container spacing={1} mt={1}>
              {images.map((img, idx) => (
                <Grid item key={idx}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        backgroundColor: "#fff",
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};
