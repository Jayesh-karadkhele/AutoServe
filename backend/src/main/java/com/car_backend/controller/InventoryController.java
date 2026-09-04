package com.car_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.inventory.CreateInventoryDto;
import com.car_backend.dto.inventory.InventoryResponseDto;
import com.car_backend.dto.inventory.UpdateInventoryDto;
import com.car_backend.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<InventoryResponseDto> createItem(@Valid @RequestBody CreateInventoryDto dto) {
        return ResponseEntity.ok(inventoryService.createItem(dto));
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping
    public ResponseEntity<List<InventoryResponseDto>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponseDto> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/sku/{skuCode}")
    public ResponseEntity<InventoryResponseDto> getItemBySkuCode(@PathVariable String skuCode) {
        return ResponseEntity.ok(inventoryService.getItemBySkuCode(skuCode));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponseDto> updateItem(@PathVariable Long id, @Valid @RequestBody UpdateInventoryDto dto) {
        return ResponseEntity.ok(inventoryService.updateItem(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    //------------Filters and Search--------------

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/available")
    public ResponseEntity<List<InventoryResponseDto>> getAvailableItems() {
        return ResponseEntity.ok(inventoryService.getAvailableItems());
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/low_stock")
    public ResponseEntity<List<InventoryResponseDto>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/out_of_stock")
    public ResponseEntity<List<InventoryResponseDto>> getOutOfStockItems() {
        return ResponseEntity.ok(inventoryService.getOutOfStockItems());
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<List<InventoryResponseDto>> searchItem(@RequestParam String keyword) {
        return ResponseEntity.ok(inventoryService.searchItems(keyword));
    }
}