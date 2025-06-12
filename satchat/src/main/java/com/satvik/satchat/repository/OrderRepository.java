package com.satvik.satchat.repository;

import com.satvik.satchat.dto.OrderFilter;
import com.satvik.satchat.entity.Ecommerce.OrderEntity;
import com.satvik.satchat.model.Enum.OrderStatus;
import com.satvik.satchat.payload.admin.TopCustomer;
import com.satvik.satchat.payload.admin.TopProduct;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {
  @Query(
      """
      SELECT p FROM OrderEntity p
      WHERE (:#{#orderFilter.status} IS NULL OR p.status = :#{#orderFilter.status})
        AND (:#{#orderFilter.customerId} IS NULL OR p.customer.id = :#{#orderFilter.customerId})
        AND (:#{#orderFilter.search} IS NULL OR LOWER(p.orderCode) LIKE LOWER(CONCAT('%', :#{#orderFilter.search}, '%')))
  """)
  Page<OrderEntity> findAllOrders(Pageable pageable, @Param("orderFilter") OrderFilter orderFilter);

  @Query("SELECT p FROM OrderEntity p WHERE p.customer.id = ?1")
  List<OrderEntity> findAllOrdersByCustomerId(UUID customerId);

  // ADMIN
  @Query("SELECT COUNT(p) FROM OrderEntity p")
  long totalOrders();

  @Query(
      """
      SELECT COALESCE(SUM(p.payment.amountPaid), 0)
      FROM OrderEntity p
      WHERE p.status = 'DELIVERED'
        AND p.payment.status = 'SUCCESS'
  """)
  BigDecimal getTotalRevenue();

  @Query(
      """
          SELECT COUNT(DISTINCT i.product)
          FROM OrderEntity p
          JOIN p.items i
          WHERE p.status = 'DELIVERED'
            AND p.payment.status = 'SUCCESS'
          """)
  long countProductByRevenue();

  @Query(
      """
          SELECT COUNT(DISTINCT p.customer)
          FROM OrderEntity p
          """)
  long countCustomers();

  @Query(
      """
          SELECT COUNT(p)
          FROM OrderEntity p
          WHERE p.status = 'DELIVERED'
            AND p.payment.status = 'SUCCESS'
          """)
  long totalOrdersCompleted();

  @Query(
      """
          SELECT COUNT(p)
          FROM OrderEntity p
          WHERE p.status = :status
          """)
  long countOrderByStatus(@Param("status") OrderStatus status);

  @Query(
      """
      SELECT COALESCE(SUM(i.quantity), 0)
      FROM OrderEntity p
      JOIN p.items i
      WHERE p.status = 'DELIVERED'
        AND p.payment.status = 'SUCCESS'
  """)
  long countProductSold();

  @Query(
      """
          SELECT new com.satvik.satchat.payload.admin.TopProduct(
              i.product.name,
              i.product.category.name,
              SUM(i.quantity),
              SUM(i.total)
          )
          FROM OrderEntity o
          JOIN o.items i
          WHERE o.status = 'DELIVERED'
            AND o.payment.status = 'SUCCESS'
          GROUP BY i.product.name, i.product.category.name
          ORDER BY SUM(i.quantity) DESC, SUM(i.total) DESC
          """)
  Page<TopProduct> findTopProducts(Pageable pageable);

  @Query(
      """
          SELECT new com.satvik.satchat.payload.admin.TopCustomer(
              CONCAT(o.customer.firstName, ' ', o.customer.lastName),
              o.customer.email,
              COUNT(o.id),
              SUM(o.totalAmount)
          )
          FROM OrderEntity o
          WHERE o.status = 'DELIVERED'
            AND o.payment.status = 'SUCCESS'
          GROUP BY o.customer.firstName, o.customer.lastName, o.customer.email
          ORDER BY SUM(o.totalAmount) DESC
          """)
  Page<TopCustomer> findTopCustomers(Pageable pageable);
}
