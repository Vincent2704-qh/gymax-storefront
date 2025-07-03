"use client";

import { GymmaxService } from "@/services/gymmax-service.service";
import { ServiceDto } from "@/types/service-type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ServiceDetail from "../components/ServiceDetail";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Brand } from "@/types/app-type.type";
import { BrandService } from "@/services/brand.service";

const ServiceDetailPage = () => {
  const params = useParams();
  const serviceId = Number(params["id"]);
  const [serviceDetail, setServiceDetail] = useState<ServiceDto>();
  const [serviceBrand, setServiceBrand] = useState<Brand>();

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await GymmaxService.getServiceDetail(serviceId);

        if (response.data) {
          setServiceDetail(response.data);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch service details";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
      }
    };

    fetchServiceDetail();
  }, [serviceId]);

  useEffect(() => {
    const fetchServiceBrand = async () => {
      try {
        const brandId = serviceDetail?.brandId;

        if (brandId) {
          const response = await BrandService.getBrandDetail(brandId);

          if (response.data) {
            setServiceBrand(response.data);
          }
        }
      } catch (err) {
        const errorMessage = "Failed to fetch service brand";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
      }
    };

    fetchServiceBrand();
  }, [serviceDetail?.brandId]);

  return (
    <div className="pt-[150px]">
      <Breadcrumb className="ml-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Mua sắm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{serviceDetail?.productTitle}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {serviceDetail && (
        <ServiceDetail service={serviceDetail} serviceBrand={serviceBrand!} />
      )}
    </div>
  );
};

export default ServiceDetailPage;
