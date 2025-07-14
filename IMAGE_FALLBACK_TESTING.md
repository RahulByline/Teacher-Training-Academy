# Image Fallback Testing Guide

## 🧪 Testing Scenarios

### 1. **Courses with Valid Images**
- ✅ Should display the actual course image
- ✅ Should show loading spinner while image loads
- ✅ Should fade in smoothly when loaded

### 2. **Courses with Broken Image URLs**
- ✅ Should fallback to default SVG image
- ✅ Should not cause infinite error loops
- ✅ Should show course badges and info overlay

### 3. **Courses with No Images**
- ✅ Should show gradient background with book icon
- ✅ Should display course badges and rating
- ✅ Should maintain all course information

### 4. **Moodle File URLs with Token Issues**
- ✅ Should automatically append token to pluginfile.php URLs
- ✅ Should handle URLs that already have tokens
- ✅ Should fallback gracefully if token is invalid

## 🔍 Browser Dev Tools Testing

### Network Tab Checks:
1. **Open Dev Tools** → Network tab
2. **Filter by Images** (img)
3. **Test each scenario:**
   - ✅ Valid image loads successfully (200 status)
   - ✅ Broken URL shows fallback (404 → fallback)
   - ✅ Token issues handled properly

### Console Tab Checks:
1. **Look for image errors:**
   ```javascript
   // Should see these for broken images:
   GET https://.../broken-image.jpg 404 (Not Found)
   ```
2. **Verify no infinite loops:**
   - Should not see repeated error messages
   - Should not see memory leaks

## 📊 Test Cases

### Test Case 1: Valid Course Image
```javascript
// Course with valid overviewfiles[0].fileurl
{
  id: "1",
  fullname: "Test Course 1",
  courseimage: "https://iomad.bylinelms.com/pluginfile.php/123/image.jpg",
  overviewfiles: [{
    fileurl: "https://iomad.bylinelms.com/pluginfile.php/123/image.jpg",
    mimetype: "image/jpeg"
  }]
}
```
**Expected:** Shows actual course image

### Test Case 2: Broken Image URL
```javascript
// Course with broken image URL
{
  id: "2",
  fullname: "Test Course 2",
  courseimage: "https://iomad.bylinelms.com/pluginfile.php/123/broken.jpg",
  overviewfiles: [{
    fileurl: "https://iomad.bylinelms.com/pluginfile.php/123/broken.jpg",
    mimetype: "image/jpeg"
  }]
}
```
**Expected:** Falls back to default SVG

### Test Case 3: No Image Data
```javascript
// Course with no image data
{
  id: "3",
  fullname: "Test Course 3",
  courseimage: null,
  overviewfiles: []
}
```
**Expected:** Shows gradient background with book icon

### Test Case 4: Token Issues
```javascript
// Course with pluginfile.php URL without token
{
  id: "4",
  fullname: "Test Course 4",
  courseimage: "https://iomad.bylinelms.com/pluginfile.php/123/image.jpg",
  overviewfiles: [{
    fileurl: "https://iomad.bylinelms.com/pluginfile.php/123/image.jpg",
    mimetype: "image/jpeg"
  }]
}
```
**Expected:** Automatically appends token to URL

## 🛠️ Manual Testing Steps

### Step 1: Test Valid Images
1. **Load courses with valid images**
2. **Verify loading spinner appears**
3. **Verify smooth fade-in transition**
4. **Check image quality and aspect ratio**

### Step 2: Test Broken Images
1. **Temporarily break image URLs** (change to non-existent)
2. **Verify fallback to default SVG**
3. **Check no console errors**
4. **Verify course info still displays**

### Step 3: Test No Images
1. **Remove image data from course objects**
2. **Verify gradient background appears**
3. **Check book icon is visible**
4. **Verify course badges and rating display**

### Step 4: Test Token Handling
1. **Check Network tab for token appending**
2. **Verify URLs include correct token**
3. **Test with and without existing tokens**

## 🐛 Common Issues & Solutions

### Issue 1: Images Not Loading
**Symptoms:** All images show fallback
**Solutions:**
- Check Moodle file permissions
- Verify web service token has file access
- Check CORS settings on Moodle server

### Issue 2: Infinite Error Loops
**Symptoms:** Console flooded with errors
**Solutions:**
- Verify `onerror = null` is set
- Check fallback image exists at `/images/default-course.svg`
- Ensure no circular references

### Issue 3: Token Not Appended
**Symptoms:** Images fail with 403/401 errors
**Solutions:**
- Verify API_TOKEN is correct
- Check token has file access permissions
- Test token manually in browser

### Issue 4: Performance Issues
**Symptoms:** Slow loading, multiple requests
**Solutions:**
- Implement image caching
- Use lazy loading for images
- Optimize image sizes on Moodle side

## 📈 Performance Monitoring

### Metrics to Track:
1. **Image Load Success Rate** (should be >90%)
2. **Average Image Load Time** (should be <2s)
3. **Fallback Usage Rate** (should be <10%)
4. **Error Rate** (should be <5%)

### Monitoring Code:
```javascript
// Add to CourseCard component for monitoring
useEffect(() => {
  if (imageUrl) {
    const startTime = performance.now();
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`Image loaded in ${loadTime}ms`);
    };
    img.onerror = () => {
      console.log('Image failed to load, using fallback');
    };
    img.src = imageUrl;
  }
}, [imageUrl]);
```

## ✅ Checklist

- [ ] Valid images load correctly
- [ ] Broken images fallback gracefully
- [ ] No images show gradient background
- [ ] Token is appended to pluginfile.php URLs
- [ ] No infinite error loops
- [ ] Loading spinner works
- [ ] Smooth transitions
- [ ] Course info displays correctly
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Works on different browsers
- [ ] Works on mobile devices 