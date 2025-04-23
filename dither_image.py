from PIL import Image

def dither_image(input_image_path, output_image_path, scale_factor=1, num_colors=16):
    # Open the input image
    image = Image.open(input_image_path)
    
    # Convert the image to a limited color palette
    palette_image = image.convert("P", palette=Image.ADAPTIVE, colors=num_colors)
    
    # Resize the image to make pixels larger
    larger_image = palette_image.resize(
        (palette_image.width * scale_factor, palette_image.height * scale_factor),
        Image.NEAREST
    )
    
    # Save the dithered image with colors
    larger_image.save(output_image_path)
    print(f"Dithered image saved as {output_image_path}")

if __name__ == "__main__":
    input_path = "./src/assets/audience.png"  # Replace with your input image path
    output_path = "dithered_image.png"  # Replace with your desired output path
    dither_image(input_path, output_path)