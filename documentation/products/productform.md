# Product Information Management System - Technical Documentation

## Overview

This document outlines the comprehensive Product Information Management System designed for our e-commerce platform specializing in local goods and antiques. The system is engineered to capture detailed product information from sellers through a sophisticated form interface that emphasizes data validation, user experience, and AI-powered enhancements.

## System Architecture

### Technology Stack

- **Frontend Framework**: React with Next.js
- **Form Management**: React Hook Form
- **State Management**: React Query (TanStack Query)
- **Image Processing**: ImageKit CDN with AI transformations
- **Rich Text Editing**: React Quill
- **HTTP Client**: Axios

## Form Structure & Data Collection Strategy

### 1. Product Identification Fields

#### Product Title
- **Field Type**: Text input (required)
- **Validation Strategy**: 
  - Mandatory field enforced through `react-hook-form` validation
  - Empty submissions prevented at form level
- **Purpose**: Primary identifier for product listing

#### Slug
- **Field Type**: Text input (required)
- **Validation Rules**:
  - Must contain only lowercase letters, numbers, and hyphens
  - Regex pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
  - Minimum length: 3 characters
  - Maximum length: 50 characters
- **Purpose**: SEO-friendly URL generation

#### Brand
- **Field Type**: Text input (optional)
- **Purpose**: Manufacturer/brand identification for filtering and search

#### Tags
- **Field Type**: Comma-separated text input (required)
- **Format**: Values separated by commas (e.g., "antique, wooden, handcrafted")
- **Purpose**: Enhanced searchability and product categorization

### 2. Product Descriptions

#### Short Description
- **Field Type**: Textarea (required)
- **Validation Logic**:
  - Maximum word count: 100 words
  - Real-time word counting validation
  - Custom validator calculates words using `split(/\s+/)` method
- **Purpose**: Quick product overview displayed in listing pages
- **Error Handling**: Dynamic word count feedback showing current count vs. limit

#### Detailed Description
- **Field Type**: Rich Text Editor (required)
- **Component**: React Quill with custom toolbar
- **Validation Rules**:
  - Minimum word count: 100 words
  - Custom validation function filters empty strings
- **Features**:
  - Text formatting (bold, underline, strike-through)
  - Headers (H1-H6)
  - Lists (ordered/unordered)
  - Code blocks and blockquotes
  - Color and background customization
  - Media embedding (links, images, videos)
- **Purpose**: Comprehensive product information for detail pages

### 3. Categorization System

#### Category Selection
- **Data Source**: API endpoint `/product/api/get-categories`
- **Fetching Strategy**: React Query with 5-minute stale time and 2 retry attempts
- **Field Type**: Dropdown (required)
- **Implementation**: Controller component from React Hook Form
- **Error States**: Handles loading and error scenarios with user feedback

#### Sub-Category Selection
- **Dynamic Behavior**: Options populated based on parent category selection
- **Implementation**: 
  - Uses `useMemo` hook for performance optimization
  - Filters subcategories from cached data structure
  - Automatically updates when category changes
- **Validation**: Required field with form-level validation

### 4. Pricing Structure

#### Regular Price
- **Field Type**: Number input
- **Validation Rules**:
  - Minimum value: 1
  - Must be numeric (NaN check)
  - Automatic type coercion with `valueAsNumber: true`
- **Purpose**: Original/maximum retail price

#### Sale Price
- **Field Type**: Number input (required)
- **Complex Validation**:
  - Must be numeric
  - Minimum value: 1
  - Must be less than Regular Price (cross-field validation)
  - Real-time comparison using form `watch()` API
- **Error Messages**: Context-aware messages for different validation failures

### 5. Inventory Management

#### Stock Quantity
- **Field Type**: Number input (required)
- **Validation Logic**:
  - Range: 1 to 1,000 units
  - Must be whole number (integer validation)
  - Custom validator ensures `Number.isInteger()` check
- **Purpose**: Real-time inventory tracking

#### Cash on Delivery Option
- **Field Type**: Dropdown (required)
- **Options**: Yes/No
- **Default Value**: "Yes"
- **Purpose**: Payment method availability configuration

### 6. Product Variants

#### Size Selector
- **Component**: Custom reusable component with form integration
- **Implementation**: Integrated through React Hook Form Controller
- **Purpose**: Handle products with multiple size variants

#### Color Selector
- **Component**: Custom component for color management
- **Features**: Visual color picker interface
- **Integration**: Connected to form state through Controller

### 7. Dynamic Specifications System

#### Custom Specifications
- **Implementation**: Dynamic field array using `useFieldArray` hook
- **Structure**: Key-value pairs (name and value)
- **Features**:
  - Add unlimited specifications dynamically
  - Remove individual specifications
  - Each specification name is required
- **Use Case**: Flexible attribute system (e.g., Material: Wood, Weight: 1.5kg)

#### Custom Properties
- **Similar Implementation**: Field array pattern
- **Purpose**: Additional product attributes beyond standard specifications

### 8. Multimedia Integration

#### Video URL
- **Field Type**: Text input (optional)
- **Validation**: 
  - YouTube embed URL format enforcement
  - Regex pattern: `^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$`
- **Purpose**: Product demonstration videos

## Image Management System

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐        ┌──────────────┐                   │
│  │ File Input   │───────▶│ Base64       │                   │
│  │ Component    │        │ Conversion   │                    │
│  └──────────────┘        └──────┬───────┘                    │
│                                  │                           │
│                                  ▼                           │
│                    ┌─────────────────────────┐               │
│                    │  POST /upload-image     │               │
│                    │  { fileName: base64 }   │               │
│                    └──────────┬──────────────┘               │
└───────────────────────────────┼──────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Image Upload Handler                                  │ │
│  │  • Receives Base64 data                                │ │
│  │  • Uploads to ImageKit CDN                             │ │
│  │  • Returns { fileId, file_url }                        │ │
│  └──────────────────────┬─────────────────────────────────┘ │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    ImageKit CDN                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  • Stores original image                                    │
│  • Generates unique file ID                                 │
│  • Provides transformation-ready URLs                       │
│  • Format: baseURL/fileId?tr=transformations                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Image Upload Process

#### Multi-Image Support
- **Capacity**: Up to 8 product images per listing
- **State Management**: Array-based state with null placeholders
- **Auto-expansion**: Automatically adds new upload slot when previous slot is filled

#### Upload Workflow

1. **File Selection**: User selects image file through `ImagePlaceHolder` component
2. **Base64 Conversion**: 
   - Promise-based FileReader API
   - Converts file to Base64-encoded string
   - Error handling with promise rejection
3. **API Upload**: 
   - POST request to `/product/api/upload-product-image`
   - Payload: `{ fileName: base64String }`
   - Loading state managed with `pictureUploadingLoader`
4. **Response Handling**:
   - Receives `{ fileId, file_url }` from server
   - Updates local state at specific index
   - Integrates with form state through `setValue()`

#### Image Deletion System

```
┌──────────────────────────────────────────────────────────┐
│  handleRemoveImages(index)                               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Extract image object at index                         │
│  2. Send DELETE request with fileId                       │
│     └─▶ /product/api/delete-product-image                │
│                                                           │
│  3. Remove from local state array                         │
│  4. Add null placeholder if needed                        │
│  5. Update form state                                     │
│                                                           │
└──────────────────────────────────────────────────────────┘
```
### AI-Powered Image Enhancement System

#### ImageKit URL Transformation Architecture

ImageKit uses URL-based transformations, allowing real-time image modifications without re-uploading files.

**URL Structure**: `https://ik.imagekit.io/account/image.jpg?tr=transformation1,transformation2`

#### Available AI Enhancements

| Enhancement | Effect Code | Description |
|-------------|-------------|-------------|
| Remove Background | `e-removedotbg` | AI-powered background removal |
| Drop Shadow | `e-dropshadow` | Adds depth with shadow effect |
| Retouch | `e-retouch` | Automatic image enhancement |
| Upscale | `e-upscale` | AI upscaling for higher resolution |
| Grayscale | `e-grayscale` | Convert to black and white |
| Blur | `e-blur:10` | Apply blur with intensity |
| Sharpen | `e-sharpen` | Enhance image sharpness |
| Brighten | `e-brightness:20` | Increase brightness |
| Contrast | `e-contrast:20` | Adjust contrast levels |
| Saturation | `e-saturation:30` | Modify color saturation |

#### Transformation Application Process

```
┌───────────────────────────────────────────────────────────┐
│  Enhancement Modal Workflow                               │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  User clicks on uploaded image                            │
│         │                                                 │
│         ▼                                                 │
│  Modal opens with image preview                           │
│         │                                                 │
│         ▼                                                 │
│  User selects enhancement (e.g., "Remove BG")             │
│         │                                                 │
│         ▼                                                 │
│  applyTransformation(effect) function                     │
│         │                                                 │
│         ├──▶ Check if URL has existing ?tr= parameter    │
│         │                                                 │
│         ├──▶ IF exists: Insert effect before existing    │
│         │    transformedUrl = url.replace('?tr=',         │
│         │                      '?tr=e-removedotbg,')      │
│         │                                                 │
│         └──▶ IF not: Append new parameter                │
│              transformedUrl = url + '?tr=e-removedotbg'   │
│                                                           │
│         ▼                                                 │
│  Update selected image preview                            │
│  Update images array at selectedImageIndex                │
│         │                                                 │
│         ▼                                                 │
│  ImageKit CDN automatically applies transformation        │
│  Returns modified image at new URL                        │
│                                                           │
└───────────────────────────────────────────────────────────┘
```