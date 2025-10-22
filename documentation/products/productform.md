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