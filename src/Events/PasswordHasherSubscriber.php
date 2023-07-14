<?php 
namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Symfony\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordHasherSubscriber implements EventSubscriberInterface{
    /**
     * @var UserPasswordHasherInterface
     *  */    
    private $Hasher;
    
        public function __construct(UserPasswordHasherInterface  $Hasher)
        {
            $this->Hasher = $Hasher;
        }

    public static function getSubscribedEvents() {
      return [
        KernelEvents::VIEW => ['hashPassword',EventPriorities::PRE_WRITE ]
      ];
    }

    //getResponseForControllerResultEvent sur l'ancien version mais c'est n'est plus disponible
    public function hashPassword(ViewEvent $event) {
       $user = $event->getControllerResult();
       
       $method = $event->getRequest()->getMethod(); //POST, GET, PUT , DELETE
       if($user instanceof User && $method === "POST") {
           $hash = $this->Hasher->hashPassword($user, $user->getPassword());
           $user->setPassword($hash);
           dd($user); 
       }
    }
}