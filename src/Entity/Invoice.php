<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    subresourceOperations: [
        'api_customers_invoices_get_subresource' => [
            'normalization_context' => ['groups' => ['invoices_subresource']
        ]
    ]],
    normalizationContext: ['groups' => ['invoices_read']], 
    denormalizationContext: ['disable_type_enforcement' => true]
)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['invoices_read', 'customers_read','invoices_subresource'])]
    private $id;

    #[ORM\Column(type: 'float')]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "Le montant est obligatoire")]
    #[Assert\Type(type:'numeric', message:'Le montant de la facture doit etre numerique')]
    private $amount;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\Date(message:"La date doit etre au format YYYY-MM--DD")]
    #[Assert\NotBlank(message: "La date doit etre obligatoire")]
    private $sentAt;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "La status est obligatoire")]
    #[Assert\Choice(choices:['SENT','PAID', 'CANCELLED'], message: "Le status doit etre SENT ? PAIN ? CANCELLED")]
    private $status;

    #[ORM\ManyToOne(targetEntity: Customer::class, inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['invoices_read'])]
    #[Assert\NotBlank(message: "Le client de la facture est obligatoire")]
    private $customer;

    #[ORM\Column(type: 'integer')]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "Le chrono est obligatoire")]
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt()
    {
        return $this->sentAt;
    }

    public function setSentAt( $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono()
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
