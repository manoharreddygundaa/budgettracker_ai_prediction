# Export Data Feature - Implementation Guide

## Overview
Fully functional export feature allowing users to download transaction data in PDF, CSV, or Excel formats with customizable date ranges and transaction type filters.

## Backend Implementation

### 1. Dependencies Added (pom.xml)
```xml
<!-- PDF Generation -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itext7-core</artifactId>
    <version>7.2.5</version>
    <type>pom</type>
</dependency>

<!-- Excel Generation -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>

<!-- CSV Generation -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-csv</artifactId>
    <version>1.10.0</version>
</dependency>
```

### 2. Files Created

#### Backend Files:
- **ExportRequest.java** - DTO for export parameters (format, startDate, endDate, type)
- **ExportService.java** - Service interface
- **ExportServiceImpl.java** - Service implementation with PDF/CSV/Excel generation logic
- **ExportController.java** - REST endpoint at `/api/export`

#### Frontend Files:
- **export.js** - Export page UI component
- **export.css** - Styling for export page

### 3. Repository Method Added
```java
// TransactionRepository.java
List<Transaction> findByUserIdAndTypeAndDateBetween(
    Long userId, String type, String startDate, String endDate
);
```

### 4. API Endpoint
```
POST /api/export
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "format": "PDF|CSV|EXCEL",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "type": "ALL|EXPENSE|INCOME"
}

Response: Binary file download
```

## Frontend Implementation

### 1. Export Page Features
- Format selection (PDF, CSV, Excel) with icons
- Transaction type filter (All, Expense, Income)
- Date range picker (start and end dates)
- Download button with loading state
- Information section explaining each format

### 2. Service Method
```javascript
// userService.js
const exportData = async (exportRequest) => {
    const response = await axios.post(
        API_BASE_URL + '/api/export',
        exportRequest,
        {
            headers: AuthService.authHeader(),
            responseType: 'blob'
        }
    )
    return response.data
}
```

### 3. Sidebar Link Added
- ID: 15
- Name: "Export Data"
- Icon: "fas fa-download"
- Route: "/user/export"

## Export Formats

### PDF
- Professional formatted report
- Header with title and generation date
- Table with columns: Date, Description, Category, Type, Amount
- Total calculation at bottom
- Styled with bold headers

### CSV
- Plain text comma-separated values
- Header row: Date, Description, Category, Type, Amount
- Compatible with Excel, Google Sheets, etc.
- Lightweight and universal format

### Excel (.xlsx)
- Formatted spreadsheet with bold headers
- Auto-sized columns for readability
- Native Excel format
- Supports formulas and further analysis

## Usage Flow

1. User navigates to "Export Data" from sidebar
2. Selects desired format (PDF/CSV/Excel)
3. Chooses transaction type filter
4. Sets date range (defaults to current month)
5. Clicks "Export as [FORMAT]" button
6. File downloads automatically with filename: `transactions_YYYY-MM-DD.[ext]`

## Technical Details

### PDF Generation (iText7)
- Creates PdfDocument with tables
- Adds headers and formatted content
- Calculates totals (income positive, expenses negative)
- Returns byte array

### CSV Generation (Apache Commons CSV)
- Uses CSVPrinter with default format
- Writes header and data rows
- Flushes to ByteArrayOutputStream

### Excel Generation (Apache POI)
- Creates XSSFWorkbook (Excel 2007+ format)
- Applies cell styles (bold headers)
- Auto-sizes columns
- Writes to ByteArrayOutputStream

### File Download
- Backend returns ByteArrayResource with appropriate Content-Type
- Frontend receives blob response
- Creates temporary URL and triggers download
- Cleans up URL after download

## Security
- Protected by JWT authentication
- @PreAuthorize("hasRole('USER')") on endpoint
- User can only export their own transactions
- User ID extracted from authenticated principal

## Error Handling
- Toast notifications for success/failure
- Loading state during export
- Disabled button while processing
- Try-catch blocks in service implementation

## Testing Steps

1. **Backend Setup:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Test Exports:**
   - Login as user
   - Navigate to Export Data
   - Try each format (PDF, CSV, Excel)
   - Test different date ranges
   - Test transaction type filters
   - Verify downloaded files open correctly

## Troubleshooting

### Issue: Maven build fails
**Solution:** Run `mvn clean install -U` to force update dependencies

### Issue: PDF generation error
**Solution:** Ensure itext7-core dependency type is set to `pom`

### Issue: File doesn't download
**Solution:** Check browser console, verify responseType: 'blob' in axios call

### Issue: Empty export
**Solution:** Verify date range contains transactions, check transaction type filter

## Future Enhancements
- Add charts/graphs to PDF exports
- Email export option
- Scheduled automatic exports
- Custom column selection
- Multiple file format download at once
- Export templates with branding
