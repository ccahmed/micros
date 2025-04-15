package com.esprit.microservice.facture_micro.utils;

import java.util.HashMap;
import java.util.Map;

public class StaticData {
    private static final Map<Long, Double> PRODUCT_PRICES = new HashMap<>();
    private static final Map<Long, String> PRODUCT_NAMES = new HashMap<>();
    private static final Map<Long, Boolean> USERS = new HashMap<>();
    
    static {
        // Initialisation des produits
        PRODUCT_PRICES.put(1L, 100.0);
        PRODUCT_PRICES.put(2L, 150.0);
        PRODUCT_NAMES.put(1L, "Produit 1");
        PRODUCT_NAMES.put(2L, "Produit 2");
        
        // Initialisation des utilisateurs
        USERS.put(1L, true);
        USERS.put(2L, true);
    }
    
    public static boolean productExists(Long productId) {
        return productId != null && PRODUCT_PRICES.containsKey(productId);
    }
    
    public static double getProductPrice(Long productId) {
        if (!productExists(productId)) {
            throw new RuntimeException("Produit non trouvé avec l'ID: " + productId);
        }
        return PRODUCT_PRICES.get(productId);
    }
    
    public static String getProductName(Long productId) {
        if (!productExists(productId)) {
            throw new RuntimeException("Produit non trouvé avec l'ID: " + productId);
        }
        return PRODUCT_NAMES.get(productId);
    }
    
    public static boolean userExists(Long userId) {
        return userId != null && USERS.containsKey(userId);
    }
} 