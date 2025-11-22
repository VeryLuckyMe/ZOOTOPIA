import React from "react";
import { Grid, Paper, Typography, Checkbox, IconButton, TextField, Box } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toaster, toast } from "sonner";
import imagePlaceholder from "../assets/image.png";

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  })
);

export default function CartItem(props) {
  const handleCheckboxChange = (event) => {
    props.onCheckChange(props.itemId, event.target.checked);
  };

  const handleIncreaseQuantity = () => {
    if (props.quantity < props.availableStock) {
      props.onQuantityChange(props.itemId, props.quantity + 1);
    } else {
      toast.error("You have reached the maximum available stock for this item.");
    }
  };

  const handleDecreaseQuantity = () => {
    if (props.quantity > 1) {
      props.onQuantityChange(props.itemId, props.quantity - 1);
    }
  };

  const handleDelete = () => {
    props.onDelete(props.itemId);
  };

  return (
    <>
      <Grid item xs={12}>
        {/* Main Paper */}
        <Paper square={false} variant="elevation" elevation={3} sx={{ padding: 2 }}>
          {/* Checkbox */}
          <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            <Grid item>
              <Checkbox checked={props.isSelected} onChange={handleCheckboxChange} />
            </Grid>

            {/* Image */}
            <Grid item>
              <Box
                component="img"
                src={props.image || imagePlaceholder}
                alt={props.title}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  objectFit: "contain",
                }}
              />
            </Grid>

            {/* Title */}
            <Grid item xs={3.36}>
              <Typography variant="body1" sx={{ width: "250px" }}>
                {props.title}
              </Typography>
            </Grid>

            {/* Price */}
            <Grid item xs={2.55}>
              <Typography variant="h6" color="primary">
                ₱{props.price}
              </Typography>
            </Grid>

            {/* Quantity */}
            <Grid item xs={2.55}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleDecreaseQuantity}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  variant="outlined"
                  size="small"
                  value={props.quantity}
                  inputProps={{ sx: { textAlign: "center" } }}
                  sx={{ width: 60 }}
                />
                <IconButton onClick={handleIncreaseQuantity}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Delete button */}
            <Grid item xs={1}>
              <LightTooltip title="Delete" placement="top">
                <IconButton color="error" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </LightTooltip>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
