<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $Hasher;

    public function __construct(UserPasswordHasherInterface  $Hasher)
    {
        $this->Hasher = $Hasher;
    }
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        
        for($u=0; $u<10; $u++){
            $user = new User();
            $chrono = 1;
            $user = new User();

            $hashed = $this->Hasher->hashPassword($user,"password");

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hashed);
            $manager->persist($user);
            
            for ($c = 0; $c<mt_rand(5,20); $c++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstname)
                    ->setLastName($faker->lastname)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user)
                    ;
                $manager->persist($customer);
    
                for ($i = 0; $i < mt_rand(3,10); $i++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 200, 5000))
                    ->setSentAt($faker->dateTimeBetween('-6 months'))
                    ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                    ->setCustomer($customer)
                    ->setChrono($chrono);

                    $manager->persist($invoice);
                }
            }
        }
        

        // $product = new Product();
        // $manager->persist();

        $manager->flush();
    }
}
