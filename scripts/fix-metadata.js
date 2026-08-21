const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');

function getPageDirs(dir, pages = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getPageDirs(fullPath, pages);
    } else if (file === 'page.tsx') {
      pages.push(dir);
    }
  }
  return pages;
}

const pageDirs = getPageDirs(appDir);

pageDirs.forEach(dir => {
  const relativePath = path.relative(appDir, dir).replace(/\\/g, '/');
  
  // Skip root as it has layout.tsx already
  if (relativePath === '') return;
  
  // we will create layout.tsx
  const layoutPath = path.join(dir, 'layout.tsx');
  
  // Calculate title based on path
  const parts = relativePath.split('/').filter(p => p && !p.startsWith('['));
  let title = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  if (!title) title = "Page";
  
  // For login we do specific
  if (relativePath === 'login') title = 'Login';
  if (relativePath === 'dashboard') title = 'Dashboard';
  
  // Generate canonical
  let canonicalPath = `/${relativePath}`;
  // For dynamic paths we should compute it dynamically if it's dynamic, but since we are doing it in layout,
  // we can use a generateMetadata function if it contains '['
  
  let code = '';
  if (relativePath.includes('[')) {
    // Dynamic route
    code = `import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  let canonicalPath = "/${relativePath}";
  // Very simplistic replacement for demo purposes, you'd replace params properly in a real app
  for (const key of Object.keys(p)) {
    canonicalPath = canonicalPath.replace(\`[\${key}]\`, p[key]);
  }
  
  return {
    title: "${title}",
    description: "View details for this ${title.toLowerCase()} in LogicPup.",
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
  } else {
    code = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title}",
  description: "View your ${title.toLowerCase()} in the LogicPup platform.",
  alternates: {
    canonical: "${canonicalPath}",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
  }
  
  if (!fs.existsSync(layoutPath)) {
    fs.writeFileSync(layoutPath, code, 'utf-8');
    console.log("Created: " + layoutPath);
  } else {
    // Modify existing layout.tsx if needed
    console.log("Exists: " + layoutPath);
  }
});
