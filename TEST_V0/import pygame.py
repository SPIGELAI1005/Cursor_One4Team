import pygame
import math

# Initialize Pygame
pygame.init()

# Set up the display
WIDTH = 800
HEIGHT = 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Racing Game")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Car class
class Car:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.angle = 0
        self.speed = 0
        self.acceleration = 0.1
        self.max_speed = 5
        self.turn_speed = 3
        self.width = 40
        self.height = 20

    def move(self):
        # Convert angle to radians
        rad = math.radians(self.angle)
        
        # Update position based on speed and angle
        self.x += math.cos(rad) * self.speed
        self.y -= math.sin(rad) * self.speed

        # Keep car within screen bounds
        self.x = max(0, min(self.x, WIDTH - self.width))
        self.y = max(0, min(self.y, HEIGHT - self.height))

    def draw(self, surface):
        # Create a rectangle for the car
        car_surface = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
        pygame.draw.rect(car_surface, RED, (0, 0, self.width, self.height))
        
        # Rotate the car surface
        rotated_surface = pygame.transform.rotate(car_surface, self.angle)
        rotated_rect = rotated_surface.get_rect(center=(self.x + self.width/2, self.y + self.height/2))
        
        # Draw the rotated car
        surface.blit(rotated_surface, rotated_rect)

# Create the player's car
player = Car(WIDTH//2, HEIGHT//2)

# Game loop
running = True
clock = pygame.time.Clock()

while running:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Handle input
    keys = pygame.key.get_pressed()
    
    # Acceleration
    if keys[pygame.K_UP]:
        player.speed = min(player.speed + player.acceleration, player.max_speed)
    elif keys[pygame.K_DOWN]:
        player.speed = max(player.speed - player.acceleration, -player.max_speed/2)
    else:
        # Apply friction when no keys are pressed
        player.speed *= 0.95

    # Turning
    if keys[pygame.K_LEFT]:
        player.angle += player.turn_speed
    if keys[pygame.K_RIGHT]:
        player.angle -= player.turn_speed

    # Update game state
    player.move()

    # Draw everything
    screen.fill(WHITE)
    
    # Draw track boundaries (simple rectangle for now)
    pygame.draw.rect(screen, BLACK, (50, 50, WIDTH-100, HEIGHT-100), 2)
    
    # Draw the car
    player.draw(screen)
    
    # Update display
    pygame.display.flip()
    
    # Control game speed
    clock.tick(60)

pygame.quit()