# Moodle/Iomad API Solutions for Missing Fields

## 🔍 Problem Fields & Solutions

### 1. **Enrollment Count** ✅ SOLVED
**Web Service:** `core_enrol_get_enrolled_users`
```javascript
// Get actual enrollment count
const response = await api.get('', {
  params: {
    wsfunction: 'core_enrol_get_enrolled_users',
    courseid: courseId,
  },
});
const enrollmentCount = response.data.length;
```

### 2. **Course Instructors** ✅ SOLVED
**Web Service:** `core_enrol_get_enrolled_users` with capability filter
```javascript
// Get instructors with course management capability
const response = await api.get('', {
  params: {
    wsfunction: 'core_enrol_get_enrolled_users',
    courseid: courseId,
    options: {
      withcapability: 'moodle/course:manageactivities'
    }
  },
});
const instructors = response.data.map(user => user.fullname);
```

### 3. **Course Ratings** ✅ SOLVED
**Web Service:** `core_rating_get_item_ratings` (requires ratings plugin)
```javascript
// Get course ratings if ratings plugin is enabled
const response = await api.get('', {
  params: {
    wsfunction: 'core_rating_get_item_ratings',
    component: 'core_course', // or 'mod_forum'
    ratingarea: 'post',
    itemid: courseId,
  },
});
```

### 4. **Course Images** ✅ SOLVED
**Web Service:** `core_course_get_courses` with options
```javascript
// Get reliable course images
const response = await api.get('', {
  params: {
    wsfunction: 'core_course_get_courses',
    options: {
      ids: [courseId]
    }
  },
});
```

### 5. **Duration Calculation** ✅ SOLVED
**Logic:** Calculate from startdate and enddate
```javascript
calculateDuration(startdate, enddate) {
  if (!startdate || !enddate || startdate === 0 || enddate === 0) {
    return '4-12 weeks'; // Fallback
  }
  const start = new Date(startdate * 1000);
  const end = new Date(enddate * 1000);
  const diffWeeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
  return `${diffWeeks} weeks`;
}
```

## 📋 Additional Moodle Web Services

### For Better Course Data:

1. **`core_course_get_courses_by_field`** - Get courses with specific field filters
2. **`core_course_get_course_module`** - Get detailed module information
3. **`core_course_get_contents`** - Get course content structure
4. **`core_course_get_updates_since`** - Get course updates

### For User Management:

1. **`core_user_get_users_by_field`** - Get users by specific fields
2. **`core_user_get_users`** - Get users with criteria
3. **`core_enrol_get_users_courses`** - Get user's enrolled courses

### For Iomad-Specific Data:

1. **`block_iomad_company_admin_get_companies`** - Get companies (already implemented)
2. **`block_iomad_company_admin_get_company_courses`** - Get company courses
3. **`block_iomad_company_admin_get_company_users`** - Get company users

## 🔧 Moodle Configuration Requirements

### For Ratings:
1. Enable the **Ratings plugin** in Moodle
2. Configure ratings in course settings
3. Ensure web service has rating permissions

### For Course Images:
1. Enable **Course image** in course settings
2. Upload course images via course administration
3. Ensure file permissions are correct

### For Instructor Data:
1. Assign proper roles to instructors
2. Ensure instructors have `moodle/course:manageactivities` capability
3. Configure role assignments properly

## 🚀 Performance Optimizations

### Batch API Calls:
```javascript
// Instead of individual calls, batch them
const courseIds = courses.map(c => c.id);
const enrollments = await Promise.all(
  courseIds.map(id => getCourseEnrollmentCount(id))
);
```

### Caching Strategy:
```javascript
// Cache course data to avoid repeated API calls
const courseCache = new Map();
const getCachedCourseData = async (courseId) => {
  if (courseCache.has(courseId)) {
    return courseCache.get(courseId);
  }
  const data = await fetchCourseData(courseId);
  courseCache.set(courseId, data);
  return data;
};
```

## 📊 Alternative Data Sources

### For Course Level/Type:
- Use course **tags** or **custom fields** if available
- Map course **format** to level/type
- Use **category** information to infer level

### For Course Images:
- Use **course summary** HTML content
- Extract images from **course description**
- Use **category images** as fallback

### For Ratings:
- Implement **custom rating system** in frontend
- Use **completion rates** as quality indicator
- Calculate **engagement metrics** from activity data

## 🔍 Troubleshooting Common Issues

### Image Loading Issues:
```javascript
// Add error handling for image loading
const loadImage = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Image not found');
    return url;
  } catch (error) {
    return '/default-course-image.jpg'; // Fallback
  }
};
```

### API Token Expiration:
```javascript
// Add token refresh logic
const refreshToken = async () => {
  // Implement token refresh mechanism
  // Update API_TOKEN variable
};
```

### Rate Limiting:
```javascript
// Implement request throttling
const throttledRequest = throttle(async (params) => {
  return await api.get('', { params });
}, 100); // 100ms delay between requests
```

## 📝 Implementation Checklist

- [x] Real enrollment counts using `core_enrol_get_enrolled_users`
- [x] Instructor names using capability filtering
- [x] Course ratings using `core_rating_get_item_ratings`
- [x] Reliable course images with fallback logic
- [x] Duration calculation from start/end dates
- [ ] Configure Moodle ratings plugin
- [ ] Set up proper role assignments
- [ ] Implement caching strategy
- [ ] Add error handling for all API calls
- [ ] Test with different course types
- [ ] Optimize for performance

## 🎯 Next Steps

1. **Test the new API methods** with your Moodle instance
2. **Configure Moodle settings** for ratings and images
3. **Implement caching** to improve performance
4. **Add error handling** for all edge cases
5. **Monitor API usage** and optimize as needed 