import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CartProvider } from "@/context/CartContext";
import { SiteProvider } from "@/context/SiteContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AboutPage } from "@/pages/AboutPage";
import { CartPage } from "@/pages/CartPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { CmsPage } from "@/pages/CmsPage";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { JournalPage } from "@/pages/JournalPage";
import { JournalPostPage } from "@/pages/JournalPostPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductPage } from "@/pages/ProductPage";
import { SearchPage } from "@/pages/SearchPage";
import { ShopPage } from "@/pages/ShopPage";
import { WishlistPage } from "@/pages/WishlistPage";

export function App() {
  return (
    <SiteProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:productId" element={<ProductPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/journal/:slug" element={<JournalPostPage />} />
                <Route path="/blog" element={<Navigate to="/journal" replace />} />
                <Route path="/blog/:slug" element={<BlogRedirect />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pages/:slug" element={<CmsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </SiteProvider>
  );
}

function BlogRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/journal/${slug}` : "/journal"} replace />;
}
