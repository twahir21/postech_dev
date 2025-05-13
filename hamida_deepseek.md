# **Software Requirements Document (SRD) - Tuuziane System**  
**Version: 1.0**  
**Last Updated: [Current Date]**  

---

## **1. Functional Requirements**  

### **1.1 User Registration & Authentication**  
- **FR1:** Users (customers, shopkeepers, drivers) must register using email/phone number and verify via OTP.  
- **FR2:** Users must log in using credentials (email/phone + password) or social login (Google, Apple).  
- **FR3:** Users must have a wallet linked to their account for payments/subscriptions.  
- **FR4:** System shall automatically deactivate accounts with insufficient wallet balance for subscription renewal.  

### **1.2 Shopkeeper & Product Management**  
- **FR5:** Shopkeepers must provide full product descriptions (name, price, warranty, size, images).  
- **FR6:** Shopkeepers can post unlimited products under their subscription.  
- **FR7:** System shall enforce tax compliance by generating electronic receipts for transactions.  
- **FR8:** Shopkeepers receive payments only after customer confirms satisfaction (no refunds requested).  

### **1.3 Customer Shopping & AI Recommendations**  
- **FR9:** Customers can browse/search products by category, price range, or shop.  
- **FR10:** System shall display alternative shops selling the same product for price comparison.  
- **FR11:** AI model shall suggest related products based on purchase history (associative rule learning).  
- **FR12:** Customers can rate products/shops (1-5 stars) and leave reviews.  

### **1.4 Order & Payment Processing**  
- **FR13:** Customers can add products to cart and checkout using mobile money (Tigo Pesa, M-Pesa, Airtel Money).  
- **FR14:** System shall hold payment until customer confirms delivery and product satisfaction.  
- **FR15:** Drivers (delivery personnel) must confirm order pickup and delivery status.  

### **1.5 Subscription & Wallet Management**  
- **FR16:** Shopkeepers/drivers must pay **30,000 TZS/month** subscription via wallet auto-deduction.  
- **FR17:** System shall notify users 3 days before subscription renewal.  
- **FR18:** Deactivated accounts can be reactivated after wallet top-up.  

### **1.6 Admin & System Management**  
- **FR19:** Admin shall monitor server storage and upgrade as needed.  
- **FR20:** System shall perform daily automated backups.  
- **FR21:** Admin shall review customer feedback for system upgrades.  

---

## **2. System Logic Flow**  

### **2.1 Customer Shopping Flow**  
1. **Browse Products**  
   - Customer opens app/web → Searches or browses products.  
   - AI suggests related products based on past purchases.  
2. **Select & Checkout**  
   - Adds to cart → Selects shop → Proceeds to checkout.  
   - Chooses payment method (mobile money).  
3. **Payment & Delivery**  
   - System holds payment → Driver picks up order → Delivers to customer.  
   - Customer confirms satisfaction → Payment released to shopkeeper.  

### **2.2 Shopkeeper Flow**  
1. **Register & Subscribe**  
   - Signs up → Pays subscription via wallet → Lists products.  
2. **Order Management**  
   - Receives order → Prepares product → Hands to driver.  
   - Payment received after customer confirmation.  

### **2.3 Driver Flow**  
1. **Accepts Delivery Request**  
   - Receives order details → Picks up product → Delivers to customer.  
2. **Confirms Delivery**  
   - Marks as delivered → Customer rates service.  

### **2.4 Admin Flow**  
1. **Server & Data Management**  
   - Monitors storage → Upgrades server if needed.  
   - Ensures daily backups.  
2. **Feedback & Upgrades**  
   - Analyzes reviews → Plans system improvements.  

---

## **3. Non-Functional Requirements**  
- **Performance:** System should handle 1,000+ concurrent users.  
- **Security:** Encrypted transactions, secure API endpoints.  
- **Compatibility:** Responsive on Android, iOS, and web browsers.  
- **Scalability:** Server upgrades based on user growth.  

---

## **4. Conclusion**  
Tuuziane v1.0 aims to simplify online shopping in Tanzania with AI-driven recommendations, secure payments, and a subscription-based model. Future versions will incorporate user feedback for enhancements.  

**Approval:**  
[Company Representative Name]  
[Signature & Date]  

---  
**End of Document**  


