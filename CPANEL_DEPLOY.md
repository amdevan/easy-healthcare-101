# Easy Healthcare 101 v2 - cPanel Deployment Guide

This guide explains how to deploy the application to a cPanel shared hosting environment using a **Single Domain Setup**.

- **URL**: `https://easyhealthcare101.com` (Both Frontend and Admin)

---

## Prerequisites

1.  **cPanel Access** with ability to create a database and upload files.
2.  **Node.js & NPM** (local machine for building).
3.  **Composer** (local machine for building).

---

## Step 1: Build the Project (Local Machine)

We have a script that builds the React frontend, places it inside the Laravel public folder, and zips everything for deployment.

1.  Open your terminal in the project root.
2.  Run the build script:
    ```bash
    ./build-cpanel.sh
    ```
3.  This will create a `cpanel_file.zip` file containing the complete application.

---

## Step 2: Deploy to cPanel

1.  **Identify Document Root**:
    -   In cPanel, go to **Domains**.
    -   Note the **Document Root** for your domain (e.g., `/public_html`).

2.  **Upload Files**:
    -   Open **File Manager**.
    -   Navigate to the **Document Root** (e.g., `public_html`).
    -   Upload `cpanel_file.zip` and extract it directly into the root.
    -   (You should see `app`, `bootstrap`, `public`, `install.php`, etc. in the main folder).

3.  **Create Database**:
    -   Go to **MySQL® Database Wizard**.
    -   Create a database (e.g., `user_easyhealth`).
    -   Create a user (e.g., `user_admin`).
    -   Grant **ALL PRIVILEGES**.
    -   Note down these credentials.

4.  **Run Installer**:
    -   Open your browser and navigate to `https://yourdomain.com/install.php`.
    -   Follow the wizard:
        -   **Step 1**: Requirements Check.
            -   **Permissions**: If Storage or Cache show "Not Writable", click **"Attempt to Fix Permissions"** or set them manually to **775** in File Manager.
        -   **Step 2**: Enter Database Credentials.
        -   **Step 3**: Enter your Application URL (e.g., `https://easyhealthcare101.com`).
        -   **Step 4**: Start Installation.
    -   **Important**: Delete `install.php` after success.

---

## Troubleshooting

-   **404 on Refresh**: Ensure the `.htaccess` file in the root is present. It handles both Laravel and React routing.
-   **500 Error**: Check `storage/logs/laravel.log`. Ensure PHP version is 8.1+.
-   **Static Assets Not Loading**: If images or styles are missing, try running the "Fix Storage" tool in the installer's final step.
