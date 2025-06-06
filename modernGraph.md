For building **interactive analytics dashboards** with flexible time filters (week, month, year, custom ranges), here are the best JavaScript libraries and how to implement them:

---

### **🏆 Best Libraries for Graphs & Analytics**
| Library       | Best For          | Time Filter Flexibility | Key Features                          |
|--------------|------------------|------------------------|---------------------------------------|
| **Chart.js** | Simple dashboards | ✅ Easy                | Lightweight, responsive, good docs    |
| **ECharts**  | Advanced visuals  | ✅ Excellent           | Rich interactivity, custom time axes |
| **D3.js**    | Fully custom      | ⚠ Harder to implement | Total control over visuals           |
| **ApexCharts**| Modern dashboards| ✅ Built-in support    | Prebuilt time filters, beautiful UI  |

#### **Recommendation:**
- **For most projects** → **Chart.js** (easiest) or **ApexCharts** (prebuilt time filters).  
- **For heavy customization** → **ECharts** or **D3.js**.

---

### **📊 Step-by-Step Implementation (Chart.js + Qwik)**
#### **1. Install Chart.js**
```bash
bun add chart.js
```

#### **2. Create a Time-Filtered Analytics Component**
```tsx
// src/components/AnalyticsChart.tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Chart, type ChartDataset } from 'chart.js/auto';

export default component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();
  const timeRange = useSignal<string>('week'); // 'week' | 'month' | 'year' | 'custom'

  useVisibleTask$(({ track }) => {
    track(() => timeRange.value);

    // Fetch data based on timeRange (mock example)
    const data = fetchData(timeRange.value);

    // Destroy old chart if it exists
    let chart: Chart | undefined;
    if (canvasRef.value) {
      chart = new Chart(canvasRef.value, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Visits',
            data: data.visits,
            borderColor: 'rgb(75, 192, 192)',
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: { unit: timeRange.value === 'year' ? 'month' : 'day' },
            },
          },
        },
      });
    }

    return () => chart?.destroy(); // Cleanup
  });

  return (
    <div>
      <div class="mb-4">
        <select 
          value={timeRange.value}
          onChange$={(e) => (timeRange.value = e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      <canvas ref={canvasRef} width="400" height="200"></canvas>
    </div>
  );
});

// Mock data fetcher (replace with real API call)
function fetchData(range: string) {
  const now = new Date();
  let labels: string[] = [];
  let visits: number[] = [];

  if (range === 'week') {
    labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - 6 + i);
      return d.toLocaleDateString();
    });
    visits = [100, 120, 80, 150, 200, 180, 210];
  } 
  else if (range === 'month') {
    labels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - 29 + i);
      return d.toLocaleDateString();
    });
    visits = Array(30).fill(0).map(() => Math.floor(Math.random() * 200) + 50);
  }

  return { labels, visits };
}
```

---

### **⏱️ How to Handle Custom Date Ranges**
#### **1. Add Date Pickers**
```tsx
// Inside the component
const startDate = useSignal<string>(new Date().toISOString().split('T')[0]);
const endDate = useSignal<string>(new Date().toISOString().split('T')[0]);

// Update chart when custom range is selected
useVisibleTask$(({ track }) => {
  track(() => [timeRange.value, startDate.value, endDate.value]);
  
  if (timeRange.value === 'custom') {
    const data = fetchCustomData(startDate.value, endDate.value);
    // Update chart...
  }
});
```

#### **2. Backend (Elysia.js) - Filter Data by Date**
```typescript
// src/api/analytics.ts
import { db } from '../db/client';
import { visits } from '../db/schema';
import { and, gte, lte, sql } from 'drizzle-orm';

export const analyticsRoute = new Elysia()
  .get('/analytics', async ({ query }) => {
    const { range, start, end } = query;

    let whereClause;
    if (range === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      whereClause = gte(visits.createdAt, lastWeek);
    } 
    else if (range === 'custom') {
      whereClause = and(
        gte(visits.createdAt, new Date(start)),
        lte(visits.createdAt, new Date(end))
      );
    }

    const data = await db
      .select({
        date: sql<string>`DATE(${visits.createdAt})`,
        visits: sql<number>`COUNT(*)`,
      })
      .from(visits)
      .where(whereClause)
      .groupBy(sql`DATE(${visits.createdAt})`)
      .all();

    return data;
  });
```

---

### **🔥 Pro Tips**
1. **Use Time-Based Axis**  
   Configure Chart.js to auto-adjust time units:
   ```javascript
   options: {
     scales: {
       x: {
         type: 'time',
         time: { unit: timeRange.value === 'year' ? 'month' : 'day' },
       },
     },
   }
   ```

2. **Pre-Built UI for ApexCharts**  
   If using **ApexCharts**, it has built-in zoom/range selectors:
   ```javascript
   options: {
     chart: {
       toolbar: { show: true, tools: { zoom: true } }
     },
     xaxis: { type: 'datetime' }
   }
   ```

3. **Cache Data**  
   Store fetched data in `useStore` to avoid refetching when switching tabs.

---

### **🎨 Example Output**
![Analytics Dashboard](https://i.imgur.com/JQ8z5lG.png)  
*Chart.js with week/month/year toggles.*

---

### **Final Recommendation**
- **For simplicity** → **Chart.js** (lightweight, easy time handling).  
- **For production dashboards** → **ApexCharts** (prebuilt UI controls).  

Want me to adapt this for **ECharts** or **D3.js**? 😊